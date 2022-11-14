const express = require('express');
const app = express();
const https = require('https');
const retrieveSecrets = require('./config/env.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const fsPromises = require("fs").promises;
const pino = require('pino');
const cors = require('cors');
const {logger} = require('./config/pino');
const cron = require('node-cron');
const mongoose = require('mongoose');
const BTC = require('./models/btc');
const path = require('path');
const btc = require('./models/btc');
const BTC_USDT_FTX_1h = require('./models/btc-ftx-1h');
const scrapingRoutes = require('./routes/users');
const ATR = require('technicalindicators').ATR;
const ccxt = require ('ccxt');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { WebsocketClient } = require('ftx-api');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
    try{
        const secretsString = await retrieveSecrets();
        await fsPromises.writeFile(".env", secretsString);
        dotenv.config();

        const PORT = 8085;
        app.listen(PORT, async () => {
            mongoose.connect( process.env.URLDB , {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
            if(err) throw err;
            logger.info('database Online');
            });
        logger.info(`listen on PORT ${PORT}`);
        });
    
        app.use(express.static('public'));
        app.use(scrapingRoutes);
        const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));






    }catch (err){
        logger.error(`error connection ${err}`)
    }
    

//     const wsConfig = {
//         key: process.env.FTX_KEY,
//         secret: process.env.FTX_KEY_SECRET,
//     }

//     const ws = new WebsocketClient(wsConfig);
//     ws.subscribe({
//         channel: 'ticker',
//         market: 'BTC/USDT'
//     });
//     ws.on('response', msg => console.log('response: ', msg));
    
//     let high = 0;
//     let low = 0;


// cron.schedule(`3 */1 * * *`, () => {
//     (async () => {
//         try{
//             const findLastRecord = await BTC_USDT_FTX_1h.find().sort({unix: -1}).limit(1);
//             const exchange = new ccxt.ftx ()
//             const symbol = 'BTC/USDT'
//             const limit = 1;
//             const market = await exchange.fetchOHLCV(symbol, timeframe = '1h', since = findLastRecord[0].unix, limit);
//             if(findLastRecord[0].unix === market[0][0]){
//                 console.log(market);
//                 high = market[0][2];
//                 low = market[0][3];
//                 console.log(`current high price: ${high}`)
//                 console.log(`current low price: ${low}`)
//             }else{
//                 console.log(`create new record`)
//             }
//         }catch(err){
//             console.log(err)
//         }
//     })()
// }, {
//     scheduled: true,
//     timezone: "America/Argentina/Buenos_Aires"
// });


// ws.on('update', msg => {
//     let date = new Date();
//     date.setMinutes(0);
//     date.setSeconds(0);
//     date.setMilliseconds(0);
//     let timeFrame = date.getTime();
//     let currentTimeFrame = (new Date()).getTime()
//     if( currentTimeFrame  > timeFrame+150000){
//     if(low === 0 || high === 0 || low === undefined || high === undefined){
//         console.log(`low/high without price. Find Market price: ${low} ${high}`)
//         BTC_USDT_FTX_1h.find().sort({unix: -1}).limit(1)
//         .then(res => {
//             const exchange = new ccxt.ftx ()
//             const symbol = 'BTC/USDT'
//             const limit = 1;
//             const market = exchange.fetchOHLCV(symbol, timeframe = '1h', since = res[0].unix, limit)
//             .then(result => {
//                 console.log(`last price market:`, result[0])
//                 if(res[0].unix === result[0][0]){
//                     if(res[0].high < result[0][2] || res[0].low < result[0][3]){
//                         BTC_USDT_FTX_1h.findOneAndUpdate({unix: res[0].unix}, {low: result[0][3], high: result[0][2]})
//                         .then(resUpdate => console.log(resUpdate))
//                         .catch(resUpdateError => console.log(resUpdateError));
//                         high = result[0][2];
//                         low = result[0][3];
//                         console.log(`current high market price: ${high}`)
//                         console.log(`current low market price: ${low}`)                      
//                     }else{
//                         high = result[0][2];
//                         low = result[0][3];
//                         console.log(`current high market price: ${high}`)
//                         console.log(`current low market price: ${low}`)
//                     }
//                 }
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     }else {
//         if(high < msg.data.ask){
//             console.log(new Date(currentTimeFrame))
//             console.log(new Date(timeFrame), timeFrame)
//             console.log(msg.data.ask, high);
//             console.log(`last high price: ${high}`)
//             high = msg.data.ask
//             console.log(`new high price: ${high}`)
//             BTC_USDT_FTX_1h.findOneAndUpdate({unix: timeFrame}, {high: high})
//             .then(res => {
//                 BTC_USDT_FTX_1h.findOne({unix: (timeFrame-3600000)})
//                     .then(resAtr => {
//                         let newAtr = (resAtr.atr * 6 + Math.max( Math.max(( high - res.low), ( high - res.open)), (res.low - res.open ) )) / 7;
//                         if(newAtr != resAtr.atr){
//                             BTC_USDT_FTX_1h.findOneAndUpdate({unix: timeFrame},{atr: newAtr})
//                             .then(resUpdateAtr => console.log(`update atr`))
//                             .catch(resErrorAtrUpdate => console.log(`error atr update`))
//                             logger.info(`update Atr - new atr ${newAtr} - last atr ${resAtr.atr}`)
//                         }
//                     })
//                     .catch(errAtr => {
//                         console.log(errAtr)
//                     })
//                 console.log(`update result: ${res}`)
//         })
//             .catch(err => console.log(`update result error: ${err}`))
//         }
//         if(low > msg.data.bid){
//             console.log(new Date(timeFrame))
//             console.log(new Date(currentTimeFrame))
//             console.log(`last low price: ${low}`)
//             low = msg.data.bid
//             console.log(`new low price: ${low}`)
//             BTC_USDT_FTX_1h.findOneAndUpdate({unix: timeFrame},{low: low})
//             .then(res => {
//                 BTC_USDT_FTX_1h.findOne({unix: (timeFrame-3600000)})
//                     .then(resAtr => {
//                         let newAtr = (resAtr.atr * 6 + Math.max( Math.max(( res.high - low), ( res.high - res.open)), (low - res.open ) )) / 7;
//                         if(newAtr != resAtr.atr){
//                             BTC_USDT_FTX_1h.findOneAndUpdate({unix: timeFrame},{atr: newAtr})
//                             .then(resUpdateAtr => console.log(`update atr`))
//                             .catch(resErrorAtrUpdate => console.log(`error atr update`))
//                             logger.info(`update Atr - new atr ${newAtr} - last atr ${resAtr.atr}`)
//                         }
//                     })
//                     .catch(errAtr => {
//                         console.log(errAtr)
//                     })
//                 console.log(`update result: ${res}`)
//             })
//             .catch(err => console.log(`update result error: ${err}`))
//         }
//     }
//         }else {
//             console.log(`no time to update`)
//         }
// });
// ws.on('error', msg => console.log('err: ', msg));

})();

























































// (async() => {
// const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVlIjoiNjM0NWIwZDlmYzVhOGFkZmVjNDE2NTQyIiwiaWF0IjoxNjY1NTExNjQxLCJleHAiOjMzMTY5OTc1NjQxfQ.40-Yhke8rMg252vE1YvlcjtjlmeHQRmQ62wGB1nReS0'
// const btcOHLCTaapi = await fetch(`https://api.taapi.io/candle?secret=${API_KEY}&exchange=binance&symbol=BTC/USDT&interval=15m`)
// const btcOHLCTappiResults = await btcOHLCTaapi.json();
// console.log
// (
// Number(btcOHLCTappiResults.open),
// Number(btcOHLCTappiResults.high),
// Number(btcOHLCTappiResults.low),
// Number(btcOHLCTappiResults.close),
// (Number(btcOHLCTappiResults.high) + Number(btcOHLCTappiResults.low) ) / 2,
// );
// })()


    // cron.schedule(`*/15 * * * *`, () => {
    //     (async() => {
    //     try {
    //         const API_KEYBTC = 'd673ec8511d747c1a9f8cc73e25b37e9';
    //         const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVlIjoiNjM0NWIwZDlmYzVhOGFkZmVjNDE2NTQyIiwiaWF0IjoxNjY1NTExNjQxLCJleHAiOjMzMTY5OTc1NjQxfQ.40-Yhke8rMg252vE1YvlcjtjlmeHQRmQ62wGB1nReS0'
    //         const btcOHLC = await fetch(`https://api.twelvedata.com/time_series?symbol=BTC/USD:binance&interval=15min&apikey=${API_KEYBTC}`)
    //         const btcResults = await btcOHLC.json();
            
    //         const btcATR15m = await fetch(`https://api.taapi.io/atr?secret=${API_KEY}&exchange=binance&symbol=BTC/USDT&interval=15m&period=7`);
    //         const atrResults = await btcATR15m.json();
    //         logger.info(`api atr results ${atrResults}`)

    //         const resultsTimeout = await timeout(18000);
            
    //         const btcOHLCTaapi = await fetch(`https://api.taapi.io/candle?secret=${API_KEY}&exchange=binance&symbol=BTC/USDT&interval=15m`)
    //         const btcOHLCTappiResults = await btcOHLCTaapi.json();
    //         logger.info(`api ohlc btc price results ${btcOHLCTappiResults}`)

    //         const atr = atrResults.value;
  
    //         let btcData = new BTC({
    //             date: new Date(),
    //             atr15m: atr,
    //             open: Number(btcOHLCTappiResults.open),
    //             high: Number(btcOHLCTappiResults.high),
    //             low: Number(btcOHLCTappiResults.low),
    //             close: Number(btcOHLCTappiResults.close),
    //             up: ((Number(btcOHLCTappiResults.high) + Number(btcOHLCTappiResults.low) ) / 2) - (3 * atr),
    //             down: ((Number(btcOHLCTappiResults.high) + Number(btcOHLCTappiResults.low) ) / 2) + (3 * atr),
    //             chartOHLC: [Date.now(), Number(btcOHLCTappiResults.open), Number(btcOHLCTappiResults.high), Number(btcOHLCTappiResults.low), Number(btcOHLCTappiResults.close) ]
    //             // open: btcResults.values[0].open,
    //             // high: btcResults.values[0].high,
    //             // low: btcResults.values[0].low,
    //             // close: btcResults.values[0].close,
    //             // up: ( (Number(btcResults.values[0].high) +  Number(btcResults.values[0].low) ) / 2) - (3 * atr),
    //             // down: (( Number(btcResults.values[0].high) +  Number(btcResults.values[0].low) ) / 2) + (3 * atr),
    //         });
    //         logger.info(`database object: ${btcData}`)
    //         btcData.save(function(err, res) {
    //                     if(err){
    //                         logger.error(`database error: ${err}`)
    //                     }else{
    //                         logger.info(`database document saved: ${res}`)
    //                     }
    //                 });
    //     }catch(err) {
    //         logger.error(`error: ${err}`)
    //     }
    
    // })()
    // }, {
    //     scheduled: true,
    //     timezone: "America/Argentina/Buenos_Aires"
    // });



    // const btcPrices = await BTC.find().sort({date: -1});
    // const high = property(btcPrices, 'high');
    // const low = property(btcPrices, 'low');
    // const close = property(btcPrices, 'close');
    // const highlow = hl2(high, low);
    // const input = {
    //     high : high,
    //     low  : low,
    //     close : close,
    //     period : 7
    //   };
    //   const dates = property(btcPrices, 'date');
    //   const atrCalc = ATR.calculate(input);
    //   const atrCalcTimes = atrCalc.map(function(x) { 
    //     (x * 3)
    // });
    // const up = [];
    // const down = [];
    // atrCalcTimes.forEach(function(ele, ind) {
    //     up.push(highlow + ele);
    //     down.push(highlow - ele);
    // });

    //   console.log(down);


