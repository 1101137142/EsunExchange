var tmp = {};
var lineChart = {};
var tmp_single = {};
var lineChart_single = {};
$(function () {
  window.setInterval(getSingleDayExchangeData(),60);
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
  now.setDate(now.getDate() - 7);
  var sevendayago = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
  $('#date_range').daterangepicker({
    "startDate": sevendayago,
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
})


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
        //console.log(data);
        var High = new Array();
        var Low = new Array();
        var HL_date = new Array();
        $.each(data, function (k, v) {
          HL_date[k] = v['rhl_date'];
          High[k] = {x: v['rhl_date'], y: v['rhl_highprice']};
          Low[k] = {x: v['rhl_date'], y: v['rhl_lowprice']};
        })
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
        //console.log(data);
        var now_data = '';
        var BaseNum = 1;
        var MaxFloatNum = 0;
        for (var i = 0; i < 10; i++) {
          var tmpBaseNum = 1;
          var test_count = 0;
          var test_val = data[i]['rd_sellrate'];
          test_val = test_val.split('.');
          if (test_val[1].length > MaxFloatNum) {
            MaxFloatNum = test_val[1].length;
          }
        }
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
        $.each(data, function (k, v) {
          var ShowTime = (v['H'] < 10 ? '0' : '') + v['H'] + ':' + (v['M'] < 10 ? '0' : '') + v['M']+ ':' + (v['S'] < 10 ? '0' : '') + v['S'];
          if (now_data == '' || parseFloat(v['rd_sellrate']) >= parseFloat(now_data) + BaseNum || parseFloat(v['rd_sellrate']) <= parseFloat(now_data) - BaseNum) {
            switch (trend) {
              case 0:
                if (parseFloat(v['rd_sellrate']) >= parseFloat(now_data) + base_multiple || parseFloat(v['rd_sellrate']) <= parseFloat(now_data) - BaseNum) {
                  ExchangeTime[DataKey] = ShowTime;
                  ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};
                  if (parseFloat(v['rd_sellrate']) >= parseFloat(now_data) + base_multiple) {
                    trend = 1;
                  }
                  now_data = v['rd_sellrate'];
                  ExchangeData2[DataKey] = {x: ShowTime, y: v['rd_sellrate'], z: trend,base:base_multiple};
                  DataKey++;
                }
                break;
              case 1:
                if (parseFloat(v['rd_sellrate']) >= parseFloat(now_data) + BaseNum || parseFloat(v['rd_sellrate']) <= parseFloat(now_data) - base_multiple) {
                  ExchangeTime[DataKey] = ShowTime;
                  ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};

                  if (parseFloat(v['rd_sellrate']) <= parseFloat(now_data) - base_multiple) {
                    trend = 0;
                  }
                  now_data = v['rd_sellrate'];
                  ExchangeData2[DataKey] = {x: ShowTime, y: v['rd_sellrate'], z: trend,base:base_multiple};
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

                  ExchangeData2[DataKey] = {x: ShowTime, y: v['rd_sellrate'], z: trend,base:base_multiple};
                  DataKey++;
                }
                break;
            }

            /*ExchangeTime[DataKey] = ShowTime;
             ExchangeData[DataKey] = {x: ShowTime, y: v['rd_sellrate']};
             now_data = v['rd_sellrate'];
             DataKey++;*/
          }
        })
        console.log(ExchangeData2);  //ExchangeData2監測走勢參數是否正確
        tmp_single.data.labels = ExchangeTime;
        /*tmp_single.data.labels.unshift('08:50');
         tmp_single.data.labels.push('23:10');*/
        tmp_single.data.datasets[0].data = ExchangeData;
        window.lineChart_single.update();
      },
      error: function (data) {
        console.log('An error occurred.');
        console.log(data);
      }
    });
  }
}
$(".content").on("change", '#currency', function (event) {
  getRangeExchangeData();
});
$(".content").on("change", '#date_range', function (event) {
  getRangeExchangeData();
});
$(".content").on("change", '#currency_single', function (event) {
  getSingleDayExchangeData();
});
$(".content").on("change", '#date_single', function (event) {
  getSingleDayExchangeData();
});
$(".content").on("change", '#base_multiple', function (event) {

  getSingleDayExchangeData();
});
setInterval(getSingleDayExchangeData,60000);