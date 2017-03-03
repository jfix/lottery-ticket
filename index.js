'use strict'

module.exports.planner = (event, context, callback) => {
  require('dotenv').config()
  const assert = require('assert')
  const moment = require('moment')
  const MongoClient = require('mongodb').MongoClient
  const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err)
    console.log('Connected correctly to server')

    let total, weekly, ticketNumber

    const ticketCollection = db.collection('lottery-ticket')
    const consoCollection = db.collection('consos')

    const getTotal = function (db, callback) {
      const consoCollection = db.collection('consos')
      consoCollection.count({}, (err, totalConsos) => {
        if (err) console.error(err)
        total = totalConsos
        callback(total)
      })
    }
    const getWeeklyConso = function (db, callback) {
      const weekStart = moment().day(0).toDate() // last sunday
      const weekEnd = moment().day(7).toDate()
      const lastWeeksConso = {
        'date': {
          $gte: weekStart,
          $lte: weekEnd
        }
      }
      consoCollection.find(lastWeeksConso).toArray((err, weeklyConsos) => {
        if (err) console.error(err)
        weekly = weeklyConsos.length
        callback(weekly)
      })
    }
    const recordTicket = function (db, callback) {
      const ticketDocument = {
        ticketNumber,
        projectedTotal: total + weekly,
        currentTotal: total
      }
      ticketCollection.insert(ticketDocument, (err, res) => {
        if (err) console.error(err)
        callback()
      })
    }

    // here is where the action happens

    // 1) get current total count of consumptions
    getTotal(db, function () {
      // 2) get last week's consumption
      getWeeklyConso(db, function () {
        // 3) choose a winning ticket number
        ticketNumber = total + Math.floor(Math.random() * weekly)
        console.log(`TOTAL: ${total}`)
        console.log(`WEEKLY: ${weekly}`)
        console.log(`TICKET: ${ticketNumber}`)
        // 4) record the winning ticket number
        recordTicket(db, function () {
          db.close()
        })
      })
    })
  })
}
