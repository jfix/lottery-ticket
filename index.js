require('./models/db')
const mongoose = require('mongoose')

const Conso = mongoose.model('Conso')
const LotteryTicket = mongoose.model('LotteryTicket')
const moment = require('moment')

// 2) get current count of consumptions
Conso.count({}, (err, total) => {
  if (err) console.error(err)
  console.log(`Last week's consumption: ${total}`)

  // 3) get last week's consumptions
  const weekStart = moment().day(0).toDate() // last sunday
  const weekEnd = moment().day(7).toDate()

  console.log(`Week goes from ${weekStart} to ${weekEnd}.`)
  const lastWeeksConso = {
    'date': {
      $gte: weekStart,
      $lte: weekEnd
    }
  }
  Conso.find(lastWeeksConso, (err, docs) => {
    if (err) console.error(err)
    console.log(`Last week's consumption: ${docs.length}`)

    // 4) total + (random value between 0 and weekly average)
    const ticket = total + Math.floor(Math.random() * docs.length)
    console.log(`The magic number is: ${ticket}`)

    // 5) store value in db collection "lottery"
    LotteryTicket.create({ticketNumber: ticket})
  })
})
