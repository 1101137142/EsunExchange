var tmp = {};
var lineChart = {};
var tmp_single = {};
var lineChart_single = {};
$(function () {
    $('#refreshTime').val('4');
    //window.setInterval(getSingleDayExchangeData(), 60);
    var areaChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'High Price',
                backgroundColor: 'rgba(60,141,188,0.9)',
                borderColor: 'rgba(60,141,188,0.8)',
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: [28, 48, 40, 19, 86, 27, 90]
            },
            {
                label: 'Low Price',
                backgroundColor: 'rgba(210, 214, 222, 1)',
                borderColor: 'rgba(210, 214, 222, 1)',
                pointColor: 'rgba(210, 214, 222, 1)',
                pointStrokeColor: '#c1c7d1',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    }

    var areaChartOptions = {
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                    gridLines: {
                        //display: false,
                    }
                }],
            yAxes: [{
                    gridLines: {
                        //display: false,
                    }
                }]
        }
    }

    var lineChartCanvas = $('#lineChart').get(0).getContext('2d')
    var lineChartOptions = jQuery.extend(true, {}, areaChartOptions)
    var lineChartData = jQuery.extend(true, {}, areaChartData)
    lineChartData.datasets[0].fill = false;
    lineChartData.datasets[1].fill = false;
    lineChartOptions.datasetFill = false
    tmp = {
        type: 'line',
        data: lineChartData,
        options: lineChartOptions
    }
    lineChart = new Chart(lineChartCanvas, tmp)

    var lineChartCanvas_single = $('#lineChart_single').get(0).getContext('2d');
    var lineChartOptions = jQuery.extend(true, {}, areaChartOptions);
    var lineChartData = jQuery.extend(true, {}, areaChartData);
    lineChartData.datasets[0].fill = false;
    lineChartData.datasets[1].fill = false;
    lineChartOptions.datasetFill = false
    tmp_single = {
        type: 'line',
        data: lineChartData,
        options: lineChartOptions
    }
    lineChart_single = new Chart(lineChartCanvas_single, tmp_single);
    lineChart_single.data.datasets.splice(1, 1)


    var now = new Date();
    var todate = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
    now.setDate(now.getDate() - 90);
    //var sevendayago = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
    var NintyDayAgo = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
    $('#date_range').daterangepicker({
        "startDate": NintyDayAgo,
        "endDate": todate,
        "autoApply": true,
        locale: {
            "separator": " ~ ",
            format: 'YYYY-MM-DD'
        }}, function (start, end, label) {
        //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
    $('#date_single').daterangepicker({
        "singleDatePicker": true,
        "startDate": todate,
        "autoApply": true,
        locale: {
            format: 'YYYY-MM-DD'
        }}, function (start, end, label) {
        //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    //取得貨幣資料
    var url = "index.php?action=ExchangeDataAction";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {doExchangeAction: 'getExchangeCurrency'}, // serializes the form's elements.
        success: function (data)
        {
            //console.log(data);
            var opt = '<option value=""></option>';
            $.each(data, function (k, v) {
                opt += "<option value='" + v['rhl_currency'] + "' ";
                if (v['rhl_currency'] == 'AUD') {
                    opt += " selected ";
                }
                opt += ">" + v['cd_name'] + "</option>";

            });
            $('.currency_class').html(opt);
            console.log(opt);
        },
        error: function (data) {
            console.log('An error occurred.');
            console.log(data);
        }
    });
})

//取得區間匯率高低點資料
function getRangeExchangeData() {
    var date = $('#date_range').val().replace(/\s/g, '').split('~');
    var currency = $('#currency').val();

    var d = new Date(date[0]);
    d.setDate(d.getDate() - 1);
    var rd = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? '0' : '') + (d.getDate());
    var d = new Date(date[1]);
    d.setDate(d.getDate() + 1);
    var ad = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? '0' : '') + (d.getDate());
    if (date && currency) {
        var url = "index.php?action=ExchangeDataAction";
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: {date: date, currency: currency, doExchangeAction: 'getExchangeDataByRange'}, // serializes the form's elements.
            success: function (data)
            {

                console.log(data);
                var High = new Array();
                var Low = new Array();
                var Max = 0;
                var Min = 9999;
                var last = 0;
                var HL_date = new Array();
                $.each(data, function (k, v) {
                    if (v['rhl_highprice'] > Max) {
                        Max = v['rhl_highprice'];
                    }
                    if (v['rhl_lowprice'] < Min) {
                        Min = v['rhl_lowprice'];
                        //Max = 0;
                    }
                    HL_date[k] = v['rhl_date'];
                    High[k] = {x: v['rhl_date'], y: v['rhl_highprice']};
                    Low[k] = {x: v['rhl_date'], y: v['rhl_lowprice']};
                    last = v['rhl_lowprice'];
                })
                var fee = parseFloat(data[0]['cd_spread'] - (data[0]['cd_discount'] * 2)).toFixed(data[0]['cd_decimalplaces']);
                var gap = parseFloat(Max - fee - Min).toFixed(data[0]['cd_decimalplaces']);
                var lastgap = parseFloat(Max - fee - last).toFixed(data[0]['cd_decimalplaces']);
                var OperatingReportingRate = (parseFloat(gap / Min * 100).toFixed(data[0]['cd_decimalplaces']));
                var LastReportingRate = (parseFloat(lastgap / last * 100).toFixed(data[0]['cd_decimalplaces']));
                var range_gap_html = '區間價差：' + gap + '元(' + Min + '/' + Max + ';最後報價：' + last + ';手續費:' + fee + ') | 區間報酬率：' + OperatingReportingRate + '%('+gap +'/'+ Min+') / 最後報價進場報酬率：' + LastReportingRate + '%('+lastgap +'/'+ last+')';
                if (parseInt($('#capital').val()) > 0 && $('#capital').val() != '') {

                    range_gap_html += ' <br>| 可產生收益:' + Math.floor((parseInt($('#capital').val()) * OperatingReportingRate) / 100);
                }

                $('#range_gap').html(range_gap_html);

                tmp.data.labels = HL_date;
                /*tmp.data.labels.unshift(rd);
                 tmp.data.labels.push(ad);*/
                tmp.data.datasets[0].data = High;
                tmp.data.datasets[1].data = Low;
                window.lineChart.update();

                /*console.log(HL_date);
                 console.log(High);
                 console.log(Low);*/
                //window.location.reload();
                //document.location.href = 'index.php?action=Showpage&Content=MissionList';
            },
            error: function (data) {
                console.log('An error occurred.');
                console.log(data);
            }
        });
    }
}
//取得單日匯率資料
function getSingleDayExchangeData() {
    var date = $('#date_single').val();
    var currency = $('#currency_single').val();
    console.log(new Date);
    if (date && currency) {
        var url = "index.php?action=ExchangeDataAction";
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: {date: date, currency: currency, doExchangeAction: 'getExchangeDataByDay'}, // serializes the form's elements.
            success: function (data)
            {
                console.log(data);
                if (data.length) {
                    var now_data = '';
                    var BaseNum = 1;
                    var MaxFloatNum = data[0]['cd_decimalplaces'];
                    var High_price = 0;
                    var Low_price = 0;
                    /*for (var i = 0; i < 10; i++) {
                     var tmpBaseNum = 1;
                     var test_count = 0;
                     var test_val = data[i]['rd_sellrate'];
                     test_val = test_val.split('.');
                     try {
                     if (test_val[1].length > MaxFloatNum) {
                     MaxFloatNum = test_val[1].length;
                     }
                     } catch (error) {
                     console.log(error);
                     console.log(test_val);
                     }
                     }*/
                    for (var i = 0; i < MaxFloatNum; i++) {
                        BaseNum = BaseNum / 10;
                    }
                    //console.log(BaseNum);
                    var base_multiple = BaseNum;
                    if (parseInt($('#base_multiple').val()) > 1) {
                        base_multiple = BaseNum * $('#base_multiple').val();
                    }
                    //console.log(BaseNum + ',' + base_multiple);
                    var DataKey = 0;
                    var ExchangeData = new Array();
                    var ExchangeData2 = new Array();
                    var ExchangeTime = new Array();
                    var trend = 2;//0降 1升 2初始 升的時候只要增加1基數(BaseNum)或是減少1倍數(base_multiple)才會寫入圖表 反之亦然
                    var last_data = new Array();
                    var cd_spread = data[0]['cd_spread'];//買賣價差
                    var cd_discount = data[0]['cd_discount'];//網銀優惠

                    $.each(data, function (k, v) {

                        if (parseFloat(v['rd_sellrate']) > High_price) {
                            High_price = parseFloat(v['rd_sellrate']);
                        }
                        if (parseFloat(v['rd_sellrate']) < Low_price || Low_price == 0) {
                            Low_price = parseFloat(v['rd_sellrate']);
                        }
                        /*if (v['rd_datetime'].match(/ .*20:15.* /)) {
                         console.log(parseFloat(v['rd_sellrate']));
                         console.log('A:' + parseFloat(v['rd_sellrate']) + ' / B1: ' + parseFloat(now_data) + ' / B:' + (parseFloat(now_data) - BaseNum) + ' / C:' + trend);
                         console.log(parseFloat(v['rd_sellrate']) <= parseFloat(now_data) - BaseNum);
                         }*/
                        var ShowTime = (v['H'] < 10 ? '0' : '') + v['H'] + ':' + (v['M'] < 10 ? '0' : '') + v['M'] + ':' + (v['S'] < 10 ? '0' : '') + v['S'];
                        //運算都要加上.toFixed(MaxFloatNum) 避免小數點不精確的問題

                        if (now_data == '' || parseFloat(v['rd_sellrate']) >= (parseFloat(now_data) + BaseNum).toFixed(MaxFloatNum) || parseFloat(v['rd_sellrate']) <= (parseFloat(now_data) - BaseNum).toFixed(MaxFloatNum)) {

                            switch (trend) {
                                case 0:
                                    if (parseFloat(v['rd_sellrate']) >= (parseFloat(now_data) + base_multiple).toFixed(MaxFloatNum) || parseFloat(v['rd_sellrate']) <= (parseFloat(now_data) - BaseNum).toFixed(MaxFloatNum)) {
                                        ExchangeTime[DataKey] = ShowTime;
                                        ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};
                                        if (parseFloat(v['rd_sellrate']) >= (parseFloat(now_data) + base_multiple).toFixed(MaxFloatNum)) {
                                            trend = 1;
                                        }
                                        now_data = v['rd_sellrate'];
                                        ExchangeData2[DataKey] = {x: ShowTime, y: v['rd_sellrate'], z: trend, base: base_multiple};
                                        DataKey++;
                                    } else {
                                        //console.log('A:' + parseFloat(v['rd_sellrate']) + ' / B:' + parseFloat(now_data) - BaseNum);
                                    }
                                    break;
                                case 1:
                                    if (parseFloat(v['rd_sellrate']) >= (parseFloat(now_data) + BaseNum).toFixed(MaxFloatNum) || parseFloat(v['rd_sellrate']) <= (parseFloat(now_data) - base_multiple).toFixed(MaxFloatNum)) {
                                        ExchangeTime[DataKey] = ShowTime;
                                        ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};

                                        if (parseFloat(v['rd_sellrate']) <= (parseFloat(now_data) - base_multiple).toFixed(MaxFloatNum)) {
                                            trend = 0;
                                        }
                                        now_data = v['rd_sellrate'];
                                        ExchangeData2[DataKey] = {x: ShowTime, y: v['rd_sellrate'], z: trend, base: base_multiple};
                                        DataKey++;
                                    }
                                    break;
                                case 2:
                                    if (now_data == '') {
                                        ExchangeTime[DataKey] = ShowTime;
                                        ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};
                                        if (now_data > parseFloat(v['rd_sellrate'])) {
                                            trend = 0;
                                        } else if (now_data < parseFloat(v['rd_sellrate'])) {
                                            trend = 1;
                                        }
                                        now_data = v['rd_sellrate'];

                                        ExchangeData2[DataKey] = {x: ShowTime, y: v['rd_sellrate'], z: trend, base: base_multiple};
                                        DataKey++;
                                    }
                                    break;
                            }

                            /*ExchangeTime[DataKey] = ShowTime;
                             ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};
                             now_data = v['rd_sellrate'];
                             DataKey++;*/
                        }
                        last_data = v;
                    })
                    var gap = High_price - Low_price;
                    gap = gap.toFixed(MaxFloatNum);
                    var OperatingReportingRate = 0;//今日最高投報率
                    OperatingReportingRate = Math.round((((High_price - cd_spread + parseFloat(cd_discount)) - (Low_price - cd_discount)) / (Low_price - cd_discount)) * 10000) / 100;//(賣價[最高價]-買價[最低價])/買價[最低價]=投報率 最後除以10000求整數 回乘100取回正確的小數點
                    var NowOperatingReportingRate = 0;//現值投報率
                    if ($('#cost_of_buying_rate').val() == '') {
                        console.log('cost_of_buying is empty');
                        //NowOperatingReportingRate=Math.round((((last_data['rd_sellrate']-cd_spread+parseFloat(cd_discount))-(Low_price-cd_discount))/(Low_price-cd_discount))*10000)/100;//(賣價[最後報價]-買價[最低價])/買價[最低價]=投報率
                        NowOperatingReportingRate = '-';//(賣價-買價)/買價=投報率 最後除以10000求整數 回乘100取回正確的小數點
                    } else {
                        console.log('cost_of_buying is not empty');
                        NowOperatingReportingRate = Math.round((((last_data['rd_sellrate'] - cd_spread + parseFloat(cd_discount)) - ($('#cost_of_buying_rate').val() - cd_discount)) / ($('#cost_of_buying_rate').val() - cd_discount)) * 10000) / 100;//(賣價[最後報價]-買價[實際成本])/買價[實際成本]=投報率
                    }

                    console.log((High_price - cd_spread + parseFloat(cd_discount)));
                    $('#today_gap').html('今日價差：' + gap + '元(' + Low_price + '/' + High_price + ') | 最後報價：' + last_data['rd_sellrate'] + '(' + (last_data['rd_sellrate'] - Low_price).toFixed(MaxFloatNum) + '/' + (High_price - last_data['rd_sellrate']).toFixed(MaxFloatNum) + ') [' + last_data['rd_datetime'] + '] ');
                    var NowProfit = 0;
                    var today_gap2_html = '';
                    if ($('#cost_of_buying_price').val() != '') {
                        NowProfit = Math.round($('#cost_of_buying_price').val() * NowOperatingReportingRate * 100) / 10000;
                        today_gap2_html = '今日投報率：' + OperatingReportingRate + '% | 現值投報率：' + NowOperatingReportingRate + '% | 目前損益：' + NowProfit;
                    } else {
                        today_gap2_html = '今日投報率：' + OperatingReportingRate + '% | 現值投報率：' + NowOperatingReportingRate + '% ';
                    }
                    $('#today_gap2').html(today_gap2_html);

                    /*console.log(High_price);
                     console.log(Low_price);*/
                    console.log(ExchangeData2);  //ExchangeData2監測走勢參數是否正確
                    tmp_single.data.labels = ExchangeTime;
                    /*tmp_single.data.labels.unshift('08:50');
                     tmp_single.data.labels.push('23:10');*/
                    tmp_single.data.datasets[0].data = ExchangeData;
                    window.lineChart_single.update();
                }
            },
            error: function (data) {
                console.log('An error occurred.');
                console.log(data);
            }
        });
    }
}
function setDateSingleByButton(dateadd){
    var now = new Date($('#date_single').val());
    now.setDate(now.getDate()+(dateadd));
    var newDate = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
    $('#date_single').val(newDate);
    $('#date_single').change();
}
function refresh()
{
    window.location.reload();
}
$(".content").on("change", '#currency', function (event) {
    getRangeExchangeData();
});
$(".content").on("change", '#date_range', function (event) {
    getRangeExchangeData();
});
$(".content").on("change", '#capital', function (event) {
    getRangeExchangeData();
});

$(".content").on("change", '#cost_of_buying_rate', function (event) {
    getSingleDayExchangeData();
});
$(".content").on("change", '#cost_of_buying_price', function (event) {
    getSingleDayExchangeData();
});
$(".content").on("change", '#currency_single', function (event) {
    getSingleDayExchangeData();
});
$(".content").on("change", '#refreshTime', function (event) {
    $('#date_single').change();
})

$(".content").on("click", '#date_single_left_button', function (event) {
    setDateSingleByButton(-1);
})
$(".content").on("click", '#date_single_right_button', function (event) {
    setDateSingleByButton(+1);
})
var timer = 0;
$(".content").on("change", '#date_single', function (event) {
    clearInterval(timer);
    var now = new Date();
    var todate = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
    var nowhour = now.getHours();
    var nowday = now.getDay();
    if (todate == $(this).val()) {
        if (nowhour >= 9 && nowhour < 23 && nowday >= 1 && nowday <= 5) {
            if ($('#refreshTime').val() != '') {

                timer = setInterval(getSingleDayExchangeData, $('#refreshTime').val() * 1000);
            } else {
                timer = setInterval(getSingleDayExchangeData, 4000);
            }

        } else {
            timer = setInterval(refresh, 600000);
        }
    } else {
        clearInterval(timer);
    }
    getSingleDayExchangeData();
});

$(".content").on("change", '#base_multiple', function (event) {
    getSingleDayExchangeData();
});