const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    unix: {type: Number},
    date: {type: Date},
    data: {type: Number},
    symbol: {type: String},
    open: {type: Number},
    high: {type: Number},
    low: {type: Number},
    close: {type: Number},
    atr15m: {type: Number},
    atr: {type: Number},
    up: {type: Number},
    down: {type: Number},
    trendUp :  {type: Number},
    trendDown :  {type: Number},
    chartOHLC: {type: Array},
}, {
    collection: 'btc/usd-ftx-1h'
})

module.exports = mongoose.model('BTC_USDT_FTX/1h', schema);