const path = require('path');
const BTC = require('../models/btc');
const BTC_USDT_FTX = require('../models/btc-ftx.js');
const BTC_USDT_FTX_15m = require('../models/btc-ftx-15m.js');
const BTC_USDT_FTX_1h = require('../models/btc-ftx-1h.js')

const {logger} = require('../config/pino');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const ATR = require('technicalindicators').ATR
const ccxt = require ('ccxt')

const cron = require('node-cron');

const API_KEY = 'QHeyoNT2xFoRKJPWGoF9XP78-NUeqDYP68xnzt1m';
const SECRET_API_KEY = 'MFVxfqsNII6bfApcfbmIu-E2ieOhnoBOnRZb1ixh';
const factor = 3

exports.getData = (req, res, next) => {
    const quantity = Number(req.query.data);
    BTC.aggregate()
    .sort({date: -1})
    .limit(quantity)
    .project({_id: 0, atr15m: 0, close: 0, date: 0, down: 0, high: 0, low: 0, open: 0, up: 0, __v: 0})
    .then(result => {
        const results= [];
        result.forEach(x => {
            results.push(x.chartOHLC)
        })
        res.status(200).json({
            ok: true,
            status: 200,
            data: results.reverse()
        })
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getDataFTX = (req, res, next) => {
    const quantity = Number(req.query.data);
BTC_USDT_FTX.aggregate()
    .sort({unix: -1})
    .limit(quantity)
    .project({atr15m: 0, symbol: 0, down: 0,  up: 0, __v: 0})
    .then(result => {
        const results= [];
        const high = [];
        const low = [];
        const close = [];
        const period = 7;
        result.forEach(function(x, ind){
            high.push(x.high)
            low.push(x.low)
            close.push(x.close)
        })
        const input = {
            high: high.reverse(),
            low: low.reverse(),
            close: close.reverse(),
            period: period
        };
        const atrResult = (ATR.calculate(input)).reverse();
        const atr = [];
        const lh2 = [];
        const up = [];
        const down = [];
        result.forEach(function(x,i) {
            results.push([(x.unix), [x.open, x.high, x.low, x.close]]);
            if(atrResult[i] === undefined){
                atr.push([x.unix, null])
            }else{
                atr.push([x.unix, atrResult[i]])
            }
            lh2.push((x.high + x.low) / 2);
            up.push([x.unix , ((x.high + x.low) / 2) - factor * atrResult[i]]);
            down.push([x.unix , ((x.high +x.low) / 2) + factor * atrResult[i]]);
        });
        res.status(200).json({
            ok: true,
            status: 200,
            data: results,
            atr: atr,
            down: down,
            up: up,
            lh2: lh2
        })
    })
    .catch(err => {
        console.log(err);
    })
};



exports.getDataFTX15m = (req, res, next) => {
    const quantity = Number(req.query.data);
BTC_USDT_FTX_15m.aggregate()
    .sort({unix: -1})
    .limit(quantity)
    .project({atr15m: 0, symbol: 0, down: 0,  up: 0, __v: 0})
    .then(result => {
        const high = [];
        const low = [];
        const close = [];
        const period = 7;
        result.forEach(function(x, ind){
            high.push(x.high)
            low.push(x.low)
            close.push(x.close)
        })
        const input = {
            high: high.reverse(),
            low: low.reverse(),
            close: close.reverse(),
            period: period
        };
        const atrResult = (ATR.calculate(input)).reverse();
        const atr = [];
        const results= [];
        const lh2 = [];
        const down = [];
        const up = [];
        result.forEach(function (x, i) {
            results.push([(x.unix), [x.open, x.high, x.low, x.close]]);
            if(atrResult[i] === undefined){
                atr.push([x.unix, null])
            }else{
                atr.push([x.unix, atrResult[i]])
            };
            lh2.push((x.high + x.low) / 2);
            up.push([x.unix , ((x.high + x.low) / 2) - factor * atrResult[i]]);
            down.push([x.unix, ((x.high +x.low) / 2) + factor * atrResult[i]]);
        });
        res.status(200).json({
            ok: true,
            status: 200,
            data: results,
            atr: atr,
            down: down,
            up: up,
            lh2: lh2
        })
    })
    .catch(err => {
        console.log(err);
    })
};


exports.getDataFTX1h = (req, res, next) => {
    const quantity = Number(req.query.data);
    BTC_USDT_FTX_1h.aggregate()
    .sort({unix: -1})
    .limit(quantity)
    .project({atr15m: 0, symbol: 0, down: 0,  up: 0, __v: 0})
    .then(result => {
        const results= [];
        const atr = [];
        const hl2 = [];
        const up = [];
        const down = [];
        result.forEach(x => {
            results.push([(x.unix), [x.open, x.high, x.low, x.close]]);
            atr.push([x.unix, x.atr]);
            hl2.push((x.high + x.low) / 2);

            up.push([x.unix , ((x.high + x.low) / 2) - factor * x.atr]);
            down.push([x.unix , ((x.high +x.low) / 2) + factor * x.atr]);
        });
        // const high = [];
        // const low = [];
        // const close = [];
        // const period = 7;
        // result.forEach(function(x, ind){
        //     high.push(x.high)
        //     low.push(x.low)
        //     close.push(x.close)
        // })
        // const input = {
        //     high: high.reverse(),
        //     low: low.reverse(),
        //     close: close.reverse(),
        //     period: period
        // };
        // const atrResult = (ATR.calculate(input)).reverse();
        res.status(200).json({
            ok: true,
            status: 200,
            data: results,
            atr: atr,
            hl2: hl2,
            up: up,
            down: down,
        })
    })
    .catch(err => {
        console.log(err);
    })
};





// cron.schedule(`*/2 * * * * *`, () => {
// BTC_USDT_FTX.findOne({atr: {$gt: 0}})
// .sort({unix: -1})
// .then(result => {
//     console.log(result)
//     const nextUnixTime = Number(result.unix)+ 60000;
//     BTC_USDT_FTX.findOne({unix: nextUnixTime})
//     .then(res =>{
//         (async () => {
//             console.log(res)
//             if( res === null){
//                 const exchange = new ccxt.ftx();
//                 const symbol = 'BTC/USDT';
//                 const limit = 1;
//                 const market = await exchange.fetchOHLCV(symbol, timeframe = '1m', since = nextUnixTime, limit);
//                 console.log(market, `No hay registro`);
//             }else{
//             const maxValue = Math.max(Math.max((res.high - res.low), (res.high - result.close)), (res.low - result.close));
//             newAtr = (result.atr * 6 + maxValue) / 7;
//             console.log(newAtr)
//             BTC_USDT_FTX.findOneAndUpdate({unix: res.unix}, {atr: newAtr})
//             .then(result => {
//                 console.log(result)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//             }
//         })()
//     })
//     .catch(error =>{
//         console.log(error)
//     })
// })
// .catch(err => {
//     console.log(err);
// })
// }, {
//     scheduled: true,
//     timezone: "America/Argentina/Buenos_Aires"
// });







// cron.schedule(`*/1 * * * * *`, () => {
// (async () =>  {
//     const exchange = new ccxt.ftx ()
//     const symbol = 'BTC/USDT'
//     const limit = 10
//     const market = await exchange.fetchOHLCV(symbol, timeframe = '1h', since = 1666306800000, limit);
//     logger.info( `${market[market.length-1]}` )


// })()

// }, {
//     scheduled: true,
//     timezone: "America/Argentina/Buenos_Aires"
// });



// FUNCION PARA CALCULAR ATR DESDE FECHA DATA ID: 63513e8ec7d7ad4586c65b5f
// (async () => {
// try {
//     const findFirstRecord =  await BTC_USDT_FTX_1h.findOne({_id: ('63513e8ec7d7ad4586c65b5f')});
//     console.log(new Date(findFirstRecord.data).toUTCString())
//     const newDate = findFirstRecord.data + 3600000;
//     console.log(new Date(newDate).toUTCString());
//     const firstAtrRecord = await BTC_USDT_FTX_1h.findOne({unix: findFirstRecord.data})
//     const nextUnixRecord = await BTC_USDT_FTX_1h.findOne({unix: newDate});
//     if(nextUnixRecord === null) return console.log(false);
//     console.log(nextUnixRecord)
//     const atr = firstAtrRecord.atr;
//     const maxValue = Math.max(Math.max((nextUnixRecord.high - nextUnixRecord.low), (nextUnixRecord.high - firstAtrRecord.close)), (nextUnixRecord.low - firstAtrRecord.close));
//     const newAtr = (atr * 6 + maxValue) / 7;
//     const findRecordAndUpdate = await BTC_USDT_FTX_1h.findOneAndUpdate({unix: newDate}, {atr: newAtr})
//     const updateData = await BTC_USDT_FTX_1h.findOneAndUpdate({_id: ('63513e8ec7d7ad4586c65b5f')}, {data: newDate});
// }catch (err){
//     console.log(err)
// }
// })()





// FUNCION PARA ACTUALIZAR OHLC DE FTX A PARTIR DE FECHA DE RECORD ID: '63513e8ec7d7ad4586c65b5f'
// (async () => {
//     try {
//         const findFirstRecord =  await BTC_USDT_FTX_1h.findOne({_id: ('63513e8ec7d7ad4586c65b5f')})
//         const newDate = findFirstRecord.data + 3600000;
//         const exchange = new ccxt.ftx ()
//         const symbol = 'BTC/USDT'
//         const limit = 2
//         const market = await exchange.fetchOHLCV(symbol, timeframe = '1h', since = findFirstRecord.data, limit);
//         if(market[1][0] === newDate) {
//         BTC_USDT_FTX_1h.findOneAndUpdate({unix: market[1][0]}, {open: market[1][1],high:  market[1][2],low:  market[1][3],close: market[1][4]})
//                                 .then(result => {
//                                     console.log(`new record 15m save DDBB`)
//                                 })
//                                 .catch(err => {
//                                     console.log(`new record 15m error: ${err}`)
//                                 })
//         }else{
//             console.log(false)
//         }
//         const updateData = await BTC_USDT_FTX_1h.findOneAndUpdate({_id: ('63513e8ec7d7ad4586c65b5f')}, {data: newDate});
//     }catch (err){
//         console.log(err)
//     }
// })()





// (async () =>  {
//     const exchange = new ccxt.ftx ()
//     const symbol = 'BTC/USDT'
//     const limit = 10
//     const market = await exchange.fetchOHLCV(symbol, timeframe = '1h', since = 1666306800000, limit);
//     console.log(market)

// })()
    