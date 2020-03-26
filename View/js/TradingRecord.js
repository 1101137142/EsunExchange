var now_format = '';
$(function () {
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
  var url = "index.php?action=TradingRecordAction";
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
        opt += "<option value='" + v['rhl_currency'] + "'>" + v['rhl_currency'] + "</option>";
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
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {data: ins_val, doExchangeAction: 'insExchangeTradingRecord'}, // serializes the form's elements.
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
function getRate() {
  var ins_val = new Object();
  //ins_val['TradingType']=$('#TradingType').val();
  ins_val['TradingTime'] = $('#TradingTime').val();
  ins_val['TradingCurrency'] = $('#TradingCurrency').val();
  //console.log(ins_val);
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: {data: ins_val, doExchangeAction: 'getExchangeCurrencyNowRate'}, // serializes the form's elements.
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
function reset() {
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('.form_ins_val').val('');
  $('#TradingTime').val(now_format);
  getRate();
}
function setTime() {
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('#TradingTime').val(now_format);
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
    if ($('#TradingTime').val() != '') {
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
  if ($('#TradingRate').val() != '' && ($('#LocalCurrencyTurnover').val() == '' || parseFloat($('#ForeignCurrencyTurnover').val() == 0))) {
    $('#LocalCurrencyTurnover').val(Math.round($('#ForeignCurrencyTurnover').val() * $('#TradingRate').val() * 100) / 100);
  }
})
/*$('#LocalCurrencyTurnover').change(function(){
 console.log($(this).val());
 })*/