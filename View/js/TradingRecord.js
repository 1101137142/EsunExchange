var now_format = '';
$(function () {
  //設定日期格式遮罩
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('#TradingTime').daterangepicker({
    "singleDatePicker": true,
    "timePicker": true,
    "timePicker24Hour": true,
    "timePickerSeconds": true,
    "startDate": now_format,
    "autoApply": true,
    locale: {
      format: 'YYYY-MM-DD HH:mm:ss'
    }}, function (start, end, label) {
    //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
  });
  
  //設定抓取紀錄的日期範圍format
  var todate = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
  now.setDate(now.getDate() - 90);
  var NintyDayAgo = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate());
  $('#schRecordDateRange').daterangepicker({
    "startDate": NintyDayAgo,
    "endDate": todate,
    //"autoApply": true,
    locale: {
      "separator": " ~ ",
      format: 'YYYY-MM-DD'
    }}, function (start, end, label) {
    //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
  });
  //設定日期區間套件的取消事件
  $('#schRecordDateRange').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
  });
  //初始設為空白
  $('#schRecordDateRange').val('');

  //取得幣別資料
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {doTradingRecordAction: 'getExchangeCurrency'}, // serializes the form's elements.
    success: function (data)
    {
      //console.log(data);
      var opt = '<option value=""></option>';
      $.each(data, function (k, v) {
        opt += "<option value='" + v['rhl_currency'] + "'>" + v['CurrencyName'] + "</option>";
      });
      $('#TradingCurrency').html(opt);
      getRate();
      //console.log(opt);
    },
    error: function (data) {
      console.log('An error occurred.');
      console.log(data);
    }
  });
  //取得有做過交易的幣別資料
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {doTradingRecordAction: 'getTradingRecordCurrency'}, // serializes the form's elements.
    success: function (data)
    {
      //console.log(data);
      var opt = '<option value=""></option>';
      $.each(data, function (k, v) {
        opt += "<option value='" + v['tr_currency'] + "'>" + v['CurrencyName'] + "</option>";
      });
      $('#schRecordCurrency').html(opt);
      getRate();
      //console.log(opt);
    },
    error: function (data) {
      console.log('An error occurred.');
      console.log(data);
    }
  });

})
function saveform() {
  var form_check = 1;
  $('.notnull').each(function () {
    if ($(this).val() == '') {
      form_check = 0;
    }
  })
  if (!form_check) {
    alert('有欄位尚未輸入');
    return 0;
  }
  var ins_val = new Object();
  $('.form_ins_val').each(function () {
    //console.log($(this).attr('type'));
    ins_val[$(this).attr('id')] = $(this).val();
  })
  //console.log(ins_val);
  //return false;
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {data: ins_val, doTradingRecordAction: 'insExchangeTradingRecord'}, // serializes the form's elements.
    success: function (data)
    {
      //console.log(data);
      if (data) {
        alert('新增完成');
        reset();
      }
    },
    error: function (data) {
      console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}
//取得交易匯率(
function getRate() {
  var ins_val = new Object();
  ins_val['TradingTime'] = $('#TradingTime').val();
  ins_val['TradingCurrency'] = $('#TradingCurrency').val();
  //console.log(ins_val);
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {data: ins_val, doTradingRecordAction: 'getExchangeCurrencyNowRate'}, // serializes the form's elements.
    success: function (data)
    {
      console.log(data);
      $.each(data['BoardRate'], function (k, v) {
        $('#TradingCurrency option[value=' + k + ']').data('BRate', v['BBoardRate']);
        $('#TradingCurrency option[value=' + k + ']').data('SRate', v['SBoardRate']);
      })
      $('#TradingType option[value=0]').data('Rate', data['BBoardRate']);
      $('#TradingCurrency').change();
      /*$('#TradingType option[value=0]').data('Rate', data['BBoardRate']);
       $('#TradingType option[value=1]').data('Rate', data['SBoardRate']);
       if ($('#TradingType').val() != '') {
       $('#TradingType').change();
       }*/
    },
    error: function (data) {
      console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}
//取得交易紀錄
function getRecord() {
  var sch_val = new Object();
  var date = new Object();
  if ($('#schRecordDateRange').val().replace(/\s/g, '') != '') {
    date = $('#schRecordDateRange').val().replace(/\s/g, '').split('~');
  }
  sch_val['schRecordCurrency'] = $('#schRecordCurrency').val();
  sch_val['date'] = date;
  console.log(sch_val);
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {data: sch_val, doTradingRecordAction: 'getExchangeTradingRecord'}, // serializes the form's elements.
    success: function (data)
    {
      console.log(data);
      /*var count_data = 0;
      var trading_table_body_html = '';
      $.each(data['BoardRate'], function (k, v) {
        if (count_data % 2 == 0) {
          trading_table_body_html += '<tr role="row" class="odd">';
        } else {
          trading_table_body_html += '<tr role="row" class="even">';
        }
        trading_table_body_html += '<td>' + v['tr_type'] + '</td>';//買賣類別
        trading_table_body_html += '<td>' + v['tr_currency'] + '</td>';//幣別
        trading_table_body_html += '<td>' + v['tr_LocalCurrencyTurnover'] + '</td>';//本幣金額
        trading_table_body_html += '<td>' + v['tr_ForeignCurrencyTurnover'] + '</td>';//外幣金額
        trading_table_body_html += '<td>' + v['tr_rate'] + '</td>';//交易匯率
        count_data++;
      })
      $('#trading_table_body').html(trading_table_body_html);*/


    },
    error: function (data) {
      //console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });


}
//重設新增用的交易資料表單
function reset() {
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('.form_ins_val').val('');
  $('#TradingTime').val(now_format);
  getRate();
}
//取得現在時間並設為交易時間
function setTime() {
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('#TradingTime').val(now_format);
  if ($('#TradingType').val() == '1') {
    console.log($('#TradingType').val());
    $('#ForeignCurrencyTurnover').val('');
  } else if ($('#TradingType').val() == '0') {
    console.log($('#TradingType').val());
    $('#LocalCurrencyTurnover').val('');
  }
  getRate();
}

$('form').on('change', '#TradingTime', function () {
  if ($('#TradingTime').val() != '' && $('#TradingCurrency').val() != '') {
    getRate();
  }
  //console.log($(this).val());
})


$('#TradingCurrency').change(function () {
  if ($(this).val() != '') {
    if ($('#TradingTime').val() != '') {  //設定該幣別的買價與賣價
      $('#TradingType option[value=0]').data('Rate', $('#TradingCurrency option[value=' + $('#TradingCurrency').val() + ']').data('BRate'));
      $('#TradingType option[value=1]').data('Rate', $('#TradingCurrency option[value=' + $('#TradingCurrency').val() + ']').data('SRate'));
    }
  }
  $('#TradingType').change();
})
$('#TradingType').change(function () {
  if ($(this).val() != '') {
    if ($('#TradingTime').val() != '' && $('#TradingCurrency').val() != '') {
      $('#TradingRate').val($('#TradingType option[value=' + $('#TradingType').val() + ']').data('Rate'));
      $('#LocalCurrencyTurnover,#ForeignCurrencyTurnover').change();
      //console.log($('#TradingType option[value=' + $('#TradingType').val() + ']').data('Rate'));
    }
  }
})
$('#TradingRate').change(function () {
  if ($(this).val() != '') {
    $('#LocalCurrencyTurnover,#ForeignCurrencyTurnover').change();
  }
})


$('form').on('change', '#LocalCurrencyTurnover', function () {
  //console.log($(this).val());
  if ($('#TradingRate').val() != '' && ($('#ForeignCurrencyTurnover').val() == '' || parseFloat($('#ForeignCurrencyTurnover').val()) == 0)) {
    $('#ForeignCurrencyTurnover').val(Math.round($('#LocalCurrencyTurnover').val() / $('#TradingRate').val() * 100) / 100);
  }
})
$('form').on('change', '#ForeignCurrencyTurnover', function () {
  //console.log($(this).val());
  if ($('#TradingRate').val() != '' && ($('#LocalCurrencyTurnover').val() == '' || parseFloat($('#LocalCurrencyTurnover').val()) == 0)) {
    $('#LocalCurrencyTurnover').val(Math.round($('#ForeignCurrencyTurnover').val() * $('#TradingRate').val() * 100) / 100);
  }
})

$('.schRecordForm').change(function () {
  console.log($(this).val());
})