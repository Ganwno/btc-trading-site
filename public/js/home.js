'use strict';

window.addEventListener('load', () => {
    const urlBinance = '/crypto';
    const urlFTX = '/crypto/btc/ftx';
    const urlFTX15m = '/crypto/btc/ftx/15m';
    const urlFTX1h = '/crypto/btc/ftx/1h';

    const modalLogIn = new bootstrap.Modal(document.querySelector('#modalSignIn'));

    let chart;
    let chartAtr;

    function trend (array, arrayClose, up){
        let counter = 0;
        array.sort(function(a,b) {
            return (a[0] - b[0])
        });
        arrayClose.sort(function(a,b) {
            return (a[0] - b[0])
        });
        let trendUp = [];
        array.forEach(function(x, i){
            if(x[1] === undefined || x[1] === null){
                false;
            }else{
                if( typeof x[1] === 'number' && (array[i-1][1] === undefined ||  array[i-1][1] === null)){
                    trendUp.push( [x[0], x[1]] );
                    counter += 1;
                }else{
                    if(up === true){
                        if(arrayClose[i-1][1][3] > trendUp[counter-1][1] ){
                            trendUp.push( [x[0], (Math.max (x[1], trendUp[counter-1][1] ) ) ] )
                            counter += 1;
                        }else{
                            trendUp.push( [x[0], x[1]] )
                            counter += 1;
                        }
                    }else{
                        if(arrayClose[i-1][1][3] < trendUp[counter-1][1] ){
                            trendUp.push( [x[0], (Math.min (x[1], trendUp[counter-1][1] ) ) ] )
                            counter += 1;
                        }else{
                            trendUp.push( [x[0], x[1]] )
                            counter += 1;
                        }
                    }
                }
            }
        })
        return new Promise ((resolve, reject) => {
            if(trendUp){
                resolve(trendUp)
            }else{
                reject()
            }
        });
    };


    function trendBuyOrSell (arrayUp, arrayDown, arrayClose, option){
        console.log(arrayUp, arrayDown)
        const result = [];
        arrayUp.sort(function(a,b) {
            return (a[0] - b[0])
        });
        arrayDown.sort(function(a,b) {
            return (a[0] - b[0])
        });
        arrayClose.sort(function(a,b) {
            return (a[0] - b[0])
        });
        arrayDown.forEach(function(x, i) {
            if(option === true){
                if(i > 0){
                    if( arrayClose[i][1][3] > arrayDown[i-1][1] ){
                        result.push( [arrayClose[i][0], arrayDown[i][1], 1 ] )
                        // result.push( [arrayClose[i][0], arrayDown[i][1] ] )
                        // console.log(i, arrayDown[i][1], 1, `linea 79`)
                    }else {
                        if( arrayClose[i][1][3] < arrayUp[i-1][1] ){
                            result.push( [arrayClose[i][0], arrayUp[i][1], -1 ] )
                            // console.log(i , arrayUp[i][1], -1, arrayDown[i][1], `linea 82`);
                            // result.push( [arrayClose[i][0], arrayUp[i][1] ] )
                        }else{
                            if(result[i-1][2] === -1  ){
                                result.push( [ arrayClose[i][0], arrayUp[i][1], result[i-1][2]] )
                                // console.log(i, arrayUp[i][1], `-1`, `linea 87`);
                                // result.push( [ arrayClose[i][0], arrayUp[i][1]] )
                            }else{
                                result.push([ arrayClose[i][0], arrayDown[i][1], result[i-1][2]] )
                                // result.push([ arrayClose[i][0], arrayDown[i][1]] )
                                // console.log(i, arrayDown[i][1], result[i-1][2], `linea 92`)
                            }
                        }
                    }
                }else{
                    result.push([ arrayClose[i][0], arrayUp[i][1], -1 ])
                    // result.push([ arrayClose[i][0], arrayUp[i][1] ])
                    // console.log(i, arrayUp[i[0]], `linea 99`)
                }
            }else{
                if(i === 0){
                    result.push(null)
                }else{
                    if( arrayClose[i][1][3] > arrayDown[i-1][1] ){
                        result.push(1)
                    }else {
                        if( arrayClose[i][1][3] < arrayUp[i-1][1] ){
                            result.push(-1)
                        }else{
                            result.push(result[i-1])
                        }
                    }
                }
            }
        });
        // const firstArray = result.map(function(x) {
        //                         if(x[2] === 1){
        //                             return [x[0], x[1]]
        //                         }else{
        //                             return [x[0], null]
        //                         }
        //                         })
        //                         .sort(function(a,b){
        //                             return a[0] - b[0]
        //                         });


        // const secondArray = result.map(function(x) {
        //                         if(x[2] === -1){
        //                             return [x[0], x[1]]
        //                         }else{
        //                             return [x[0], null]
        //                         }
        //                         })
        //                         .sort(function(a,b){
        //                             return a[0] - b[0]
        //                         });
        const signal = [];
        result.forEach(function(x, i) {
            if(i > 0 && result[i-1][2] !== x[2]){
                x[2] === 1 ? signal.push([x[0], "BUY"]) : signal.push([x[0], "SELL"])
            }
        });

        return new Promise ((resolve, reject) => {
            if(result){
                resolve([result, signal]);
            }else{
                reject()
            }
        })
    };

    function trendCalc (array, arrayClose, up){
        array.sort(function(a,b) {
            return (a[0] - b[0])
        });
        arrayClose.sort(function(a,b) {
            return (a[0] - b[0])
        });
        let trendUp = [];
        array.forEach(function(x, i){
            if(i === 0){
                trendUp.push([x[0], x[1]])
            }else{
                if(up === true){
                    if(arrayClose[i-1][1][3] > trendUp[i-1][1] ){
                        trendUp.push( [x[0], (Math.max (x[1], trendUp[i-1][1] ) ) ] )
                    }else{
                        trendUp.push( [x[0], x[1]] )
                    }
                }else{
                    if(arrayClose[i-1][1][3] < trendUp[i-1][1] ){
                        trendUp.push( [x[0], (Math.min (x[1], trendUp[i-1][1] ) )  ] )
                    }else{
                        trendUp.push( [x[0], x[1]] )
                    }
                }
            }
        });
        return new Promise ((resolve, reject) => {
            if(trendUp){
                resolve(trendUp)
            }else{
                reject()
            }
        });
    };



    function main (email, password){
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/login");
        xhttp.onreadystatechange = function(){
            if(this.readyState !== 4) return;
            if(this.status === 200){
                toastr.success(`Atenticación exitosa`);
                modalLogIn.hide();
                window.location.reload();
            }else if(this.status === 403){
                toastr.error(`Error de autenticación: ${403}`)
            }else if(this.status === 401){
                toastr.error(`Error de autenticación: ${401}`)
            }else{
                toastr.error(`Ha ocurrido un error en el servidor: ${this.status}`)
            }
        }
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`email=${email}&password=${password}`);
    };


    document.getElementById('loginUser').addEventListener('click', function(x) {
        const email = document.querySelector('#email').value;
        const pass = document.querySelector('#password').value;
        main(email, pass);
    })


    function loadData (url) {
    const quantity = document.querySelector('[name=btnradioQuantity]:checked').value;
    fetch(`${url}?data=${quantity}`, {
        method: 'GET',
    })
    .then((res) => res.json())
    .then((result) => {
        (async () => {
        try {
        if(result.ok === true){
                let trendResultUp = await trend(result.up, result.data, true);
                let trendResultDown = await trend(result.down, result.data, false);
            const optionsAtr = {
                chart: {
                    type: 'line',
                    height: 300,
                    with: '100%'
                },
                series: [{
                    name: 'ATR',
                    data: result.atr
                }],
                  xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        format: 'dd/MM HH:mm'
                    }
                  },
                yaxis: {
                    decimalsInFloat: 0,
                    tooltip: {
                        enabled: true
                }
              },
              title: {
                text: 'BTC/USDT - FTX ATR',
                align: 'vertical'
              },
            };
            const options = {
                chart: {
                  type: 'candlestick',
                  height: 800,
                  width: '100%',
                  animations: {
                    enabled: false,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 50
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 10
                    }
                },
                },
                series: [{
                    type: 'candlestick',
                    name: 'BTC/USDT OHLC',
                    data: result.data
                  },
                //   {
                //     name: 'Down',
                //     type: 'line',
                //     data: result.down,
                //   },
                //   {
                //     name: 'Up',
                //     type: 'line',
                //     data: result.up,
                //   },
                //   {
                //     name: 'trendUp',
                //     type: 'line',
                //     data: trendResultUp,
                //   },
                //   {
                //     name: 'trendDown',
                //     type: 'line',
                //     data: trendResultDown,
                //   }
                ],
                xaxis: {
                    type: 'datetime',
                    show: true,
                    labels: {
                        show: true,
                        format: 'dd/MM HH:mm'
                    }
                  },
                  yaxis: {
                    decimalsInFloat: 0,
                    show: true,
                    labels: {
                        show: true
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                tooltip: {
                        enabled: true,
                        shared: false,
                        followCursor: true,
                        fixed: {
                            enabled: true,
                            position: 'topRight',
                        },
                        x: {
                            show: true,
                            format: 'dd/MM HH:mm'
                        },
                        y: {
                            show: true
                        }
                },

                  title: {
                    text: 'BTC/USDT - FTX OHLC',
                    align: 'vertical'
                  },
                  plotOptions: {
                    candlestick: {
                      wick: {
                        useFillColor: true,
                      }
                    },
                  },
                }
                
                chart = new ApexCharts(document.getElementById('myChart'), options);
                chartAtr = new ApexCharts(document.getElementById('myChartAtr'), optionsAtr);
                setTimeout(() => {
                    console.log(true)
                    document.getElementById('myChart').classList.remove('bg-secondary');
                    document.getElementById('myChartAtr').classList.remove('bg-secondary');
                    document.getElementById('spinner01').remove();
                    document.getElementById('spinner02').remove();
                    chart.render();
                    chartAtr.render();
                    setTimeout(() => {
                    }, 3000);
                }, 5000);


        }else if( result.ok === false ){
            console.log(result)
            modalLogIn.show()
        }
        }catch(err){
            console.log(err)
        }
        })()
        })

    .catch((err) => {
        console.log(err)
        toastr.error(`Ha ocurrido un error en el servidor: ${err}`)
    })
};


function data(url){
    const quantity = document.querySelector('[name=btnradioQuantity]:checked').value;
    return fetch(`${url}?data=${quantity}`, {method: 'GET'})
};

loadData(urlFTX);

document.querySelector('#btnradio2').addEventListener('click', function(e) {
(async () => {
    const result = data(urlFTX15m)
    .then(results => results.json())
    .then(res => {
        if(res.ok === true){
            console.log(res)
            if(res.status === 401){
                console.log(res.status)
            }else{
                chart.updateSeries([{
                    data: res.data
                }]);
                chartAtr.updateSeries([{
                    data: res.atr
                }])
            }
        }else{
            modalLogIn.show()
        }

    })
    .catch(err => toastr.error(`Ha ocurrido un error en el servidor: ${err}`));

})()
});

document.querySelector('#btnradio1').addEventListener('click', function(e) {
    (async () => {
        const result = data(urlFTX)
        .then(results => results.json())
        .then(res => {
            console.log(res)
            if( res.ok === true){
                chart.updateSeries([{
                    data: res.data
                }]);
                chartAtr.updateSeries([{
                    data: res.atr
                }])                
            }else{
                modalLogIn.show()
            }
        })
        .catch(err => toastr.error(`Ha ocurrido un error en el servidor: ${err}`));

    })()
});

document.querySelector('#btnradio3').addEventListener('click', function(e) {
    (async () => {
        const result = data(urlFTX1h)
        .then(results => results.json())
        .then(res => {
            (async () => {
                if(res.ok === true){
                    let trendResultUp = await trendCalc(res.up, res.data, true);
                    let trendResultDown = await trendCalc(res.down, res.data, false);
                    let trendBuyOrSellResult = await trendBuyOrSell(trendResultUp, trendResultDown, res.data, true);
                    let axisAnnotation = [];

                    trendBuyOrSellResult[1].forEach(function(ele){


                        let border;
                        if(ele[1] === 'BUY'){
                            border = '#00B746';
                        }else{
                            border = '#EF403C';
                        }
                        axisAnnotation.push({
                            x: ele[0],
                            borderColor: border,
                            label: {
                                borderColor: border,
                                style: {
                                  color: '#fff',
                                  background: border
                                },
                                text: `${ele[1]} - ${moment(ele[0]).format('DD/MM HH:mm')}`
                            },
                            text: ele[1]
                        })
                    });

                    chartAtr.updateSeries([{
                        data: res.atr
                    }])

                    chart.destroy();

                    const options = {
                        chart: {
                          type: 'candlestick',
                          height: 800,
                          width: '100%',
                          animations: {
                            enabled: false,
                            easing: 'linear',
                            speed: 800,
                            animateGradually: {
                                enabled: true,
                                delay: 50
                            },
                            dynamicAnimation: {
                                enabled: true,
                                speed: 10
                            },
                        },
                        },
                        series: [{
                            type: 'candlestick',
                            name: 'BTC/USDT OHLC',
                            data: res.data,
                          },
                            {
                            type: 'line',
                            data: trendBuyOrSellResult[0],
                            name: 'buy/sell signal',
                            stroke: {
                                width: 10
                              },
                            },
                        ],
                        xaxis: {
                            type: 'datetime',
                            show: true,
                            labels: {
                                show: true,
                                format: 'dd/MM HH:mm'
                            }
                          },
                          yaxis: {
                            decimalsInFloat: 0,
                            show: true,
                            labels: {
                                show: true
                            },
                            tooltip: {
                                enabled: true
                            }
                        },
                        tooltip: {
                                enabled: true,
                                shared: false,
                                followCursor: true,
                                fixed: {
                                    enabled: true,
                                    position: 'topRight',
                                },
                                x: {
                                    show: true,
                                    format: 'dd/MM HH:mm'
                                },
                                y: {
                                    show: true
                                }
                        },
                          title: {
                            text: 'BTC/USDT - FTX OHLC',
                            align: 'vertical'
                          },
                          annotations: {
                            xaxis: axisAnnotation
                          },
                          plotOptions: {
                            candlestick: {
                              wick: {
                                useFillColor: true,
                              }
                            },
                            line: {
                                
                            }
                          },
                        }
                        
                        chart = new ApexCharts(document.getElementById('myChart'), options);
                        chart.render();


                }else{
                    modalLogIn.show()
                }
            })()
        })
        .catch(err =>  {
            console.log(err);
            toastr.error(`Ha ocurrido un error en el servidor: ${err}`)
        });
    })()
})






});