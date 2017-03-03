const moment = require('moment')

module.exports.planner = (event, context, callback) => {
  require('./models/db')
  const mongoose = require('mongoose')
  const Conso = mongoose.model('Conso')
  const LotteryTicket = mongoose.model('LotteryTicket')

  // 1) get current total count of consumptions
  Conso.count({}, (err, total) => {
    if (err) console.error(err)

    // 2) get last week's consumptions
    const weekStart = moment().day(0).toDate() // last sunday
    const weekEnd = moment().day(7).toDate()
    const lastWeeksConso = {
      'date': {
        $gte: weekStart,
        $lte: weekEnd
      }
    }
    Conso.find(lastWeeksConso, (err, docs) => {
      if (err) console.error(err)
      const lastWeeksConso = docs.length
      // 3) total + (random value between 0 and weekly average)
      const ticketNumber = total + Math.floor(Math.random() * lastWeeksConso)

      console.log(`Week goes from ${weekStart} to ${weekEnd}.`)
      console.log(`Current total: ${total}`)
      console.log(`This week's consumption: ${lastWeeksConso}`)
      console.log(`Projected total total: ${total + lastWeeksConso}`)
      console.log(`The magic number is: ${ticketNumber}`)
      console.log('-------------------------')
      // 4) store value in db collection "lottery-ticket"
      const ticket = {
        ticketNumber,
        projectedTotal: total + lastWeeksConso,
        currentTotal: total
      }
      LotteryTicket.create(ticket, (err, doc) => {
        if (err) callback(err)
        mongoose.connection.close()
        callback(null, `The magic number is: ${ticketNumber}`)
      })
    })
  })
}
