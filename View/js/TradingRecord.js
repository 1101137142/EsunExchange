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
  $('#schRecordDateRange').on('cancel.daterangepicker', function (ev, picker) {
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
  getRecord(1);
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
function getRecord(pageNum) {
  var sch_val = new Object();
  var date = new Object();
  if ($('#schRecordDateRange').val().replace(/\s/g, '') != '') {
    date = $('#schRecordDateRange').val().replace(/\s/g, '').split('~');
  }
  sch_val['schRecordCurrency'] = $('#schRecordCurrency').val();
  sch_val['date'] = date;
  $.each($('.trading_table'), function (k, v) {
    if (!$(this).hasClass('sorting')) {
      sch_val['orderby'] = $(this).attr('id').replace("trading_table_", "");
      if ($(this).hasClass('sorting_asc')) {
        sch_val['Inverted'] = ' asc';
      } else if ($(this).hasClass('sorting_desc')) {
        sch_val['Inverted'] = ' desc';
      }
    }
  })
  //sch_val['orderby'] = 'tr_tradingtime desc';
  sch_val['pageNum'] = pageNum;
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
      var count_data = 0;
      var trading_table_body_html = '';
      var show_type = '';
      var table_field = new Array();
      $.each($('.trading_table'), function (k, v) {
        table_field[k] = $(this).attr('id').replace("trading_table_", "");
      })
      console.log(table_field);

      $.each(data['row'], function (k, v) {
        var backGroundColor = '';
        switch (v['tr_type']) {
          case '0':
            backGroundColor = 'sellRecord';
            break;
          case '1':
            backGroundColor = 'buyRecord';
            break;
          default:
            backGroundColor = '';
            break;
        }

        if (count_data % 2 == 0) {
          trading_table_body_html += '<tr role="row" class="odd ' + backGroundColor + ' ">';
        } else {
          trading_table_body_html += '<tr role="row" class="even ' + backGroundColor + ' ">';
        }
        var show_data = '';
        $.each(table_field, function (k1, v1) {
          if (v1 == 'tr_type') {
            switch (v['tr_type']) {
              case '0':
                show_data = '賣';
                break;
              case '1':
                show_data = '買';
                break;
              case '9':
                show_data = '利息';
                break;
            }
          } else if (v1 == 'tr_currency') {
            show_data = v['CurrencyName'] + '(' + v[v1] + ')';
          } else if (v1 == 'tr_LocalCurrencyTurnover') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalLCT']).toFixed(0) + ')';
            show_data = v[v1];
          } else if (v1 == 'tr_ForeignCurrencyTurnover') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalFCT']).toFixed(v['DecimalPlaces']) + ')';
            show_data = v[v1];
          } else if (v1 == 'TotalLCT') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalFCT']).toFixed(v['DecimalPlaces']) + ')';
            show_data = parseFloat(v[v1]).toFixed(0);
          } else if (v1 == 'TotalFCT') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalFCT']).toFixed(v['DecimalPlaces']) + ')';
            show_data = parseFloat(v[v1]).toFixed(v['DecimalPlaces'])*1;
          } else if (v1 == 'cost_rate') {
            show_data = Math.abs(parseFloat(parseFloat(v['TotalLCT']).toFixed(0) / parseFloat(v['TotalFCT']).toFixed(v['DecimalPlaces'])).toFixed(v['DecimalPlaces']));
          } else {
            show_data = v[v1];
          }
          if (v1 == 'tr_LocalCurrencyTurnover' || v1 == 'tr_ForeignCurrencyTurnover' || v1 == 'tr_rate' || v1 == 'tr_tradingtime') {
            trading_table_body_html += '<td class="text-right" >' + show_data + '</td>';
          } else {
            trading_table_body_html += '<td>' + show_data + '</td>';
          }
        })
        count_data++;
      })
      console.log(trading_table_body_html);
      $('#trading_table_body').html(trading_table_body_html);
      var max_page = Math.ceil(data['rowcount'] / 10);
      console.log(max_page);
      //設定頁尾頁數連結

      var pagination_html = '';
      var isNowPage = '';
      //如果總頁數不超過五頁 直接列出
      if (max_page < 6) {
        for (var i = 1; i < max_page; i++) {
          pagination_html += ' <li class="paginate_button page-item ';
          if (i == pageNum) {
            pagination_html += ' active ';
          } else {
            pagination_html += ' onclick="getRecord(' + i + ')';
          }
          pagination_html += ' "><a href="#" aria-controls="trading_table" data-dt-idx="' + i + '" tabindex="0" class="page-link">' + i + '</a></li>';
        }
      } else {
        //如果超過五頁 判斷現在頁數是不是大於第三頁 是的話需要做省略
        if (pageNum > 3) {
          pagination_html += '<li class="paginate_button page-item previous " id="trading_table_previous" onclick="getRecord(' + (pageNum - 1) + ')"> <a href="#" data-dt-idx="0" tabindex="0" class="page-link">Previous</a> </li>';
          pagination_html += '<li class="paginate_button page-item "  onclick="getRecord(1)"><a href="#"  data-dt-idx="1" tabindex="0" class="page-link">1</a></li>';
          if (pageNum > 4) {
            pagination_html += '<li class="paginate_button page-item ">...</li> ';
          }
        } else if (pageNum != '1') {
          pagination_html += '<li class="paginate_button page-item previous " id="trading_table_previous" onclick="getRecord(' + (pageNum - 1) + ')"> <a href="#" data-dt-idx="0" tabindex="0" class="page-link">Previous</a> </li>';
        }
        //此部分是中間頁數判斷 如果現在頁面扣掉必須要顯示的兩頁會造成溢位 那就需要減少顯示的頁數(現在頁數為1 則顯示3頁  2為4頁)
        if (pageNum - 2 < 1) {
          for (var i = 0; i < pageNum + 2; i++) {
            isNowPage = '';
            if (pageNum == parseInt(i + 1)) {
              isNowPage = ' active ';
            }
            pagination_html += '<li class="paginate_button page-item ' + isNowPage + '" ><a href="#" onclick="getRecord(' + parseInt(i + 1) + ')" aria-controls="trading_table" data-dt-idx="' + parseInt(i + 1) + '" tabindex="0" class="page-link">' + parseInt(i + 1) + '</a></li>'
          }
          //此部分為最大頁數判斷 如果最大頁數-2大於現在頁數 那代表可以正常顯示五頁
        } else if (pageNum < max_page - 2) {
          var hrefPageNum = 0;
          for (var i = 0; i < 5; i++) {
            hrefPageNum = parseInt(pageNum + i) - 2;

            isNowPage = '';
            if (pageNum == hrefPageNum) {
              isNowPage = ' active ';
            }
            console.log(hrefPageNum);
            pagination_html += '<li class="paginate_button page-item' + isNowPage + ' " onclick="getRecord(' + hrefPageNum + ')"><a href="#" aria-controls="trading_table" data-dt-idx="' + hrefPageNum + '" tabindex="0" class="page-link">' + hrefPageNum + '</a></li>';
            console.log(pagination_html);
          }
          //如果最大頁數-2沒有大於現在頁數 代表顯示頁數需要減少
        } else if (pageNum >= max_page - 2) {

          var hrefPageNum = 0;
          for (var i = 0; i < 3 + (max_page - pageNum); i++) {
            hrefPageNum = parseInt(pageNum + i) - 2;
            console.log(hrefPageNum);
            isNowPage = '';
            if (pageNum == hrefPageNum) {
              isNowPage = ' active ';
            }
            pagination_html += '<li class="paginate_button page-item' + isNowPage + ' " onclick="getRecord(' + hrefPageNum + ')"><a href="#" aria-controls="trading_table" data-dt-idx="' + hrefPageNum + '" tabindex="0" class="page-link">' + hrefPageNum + '</a></li>'
          }
          console.log(pagination_html);
        }
        if (pageNum < max_page - 2) {
          if (pageNum < max_page - 3) {
            pagination_html += '<li class="paginate_button page-item ">...</li> ';
          }
          pagination_html += '<li class="paginate_button page-item "  onclick="getRecord(' + max_page + ')" ><a href="#"  data-dt-idx="' + max_page + '" tabindex="0" class="page-link">' + max_page + '</a></li>';
          pagination_html += '<li class="paginate_button page-item next" id="trading_table_next"  onclick="getRecord(' + parseInt(pageNum + 1) + ')" ><a href="#" aria-controls="trading_table" data-dt-idx="7" tabindex="0" class="page-link">Next</a></li>';
        } else if (pageNum != max_page) {
          pagination_html += '<li class="paginate_button page-item next" id="trading_table_next"  onclick="getRecord(' + parseInt(pageNum + 1) + ')" ><a href="#" aria-controls="trading_table" data-dt-idx="7" tabindex="0" class="page-link">Next</a></li>';
        }

      }
      $('#trading_table_info').html('Showing ' + parseInt((pageNum - 1) * 10 + 1) + ' to ' + pageNum * 10 + ' of ' + data['rowcount'] + ' entries');
      $('.pagination').html(pagination_html);
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
//console.log($(this).val());
  getRecord(1);
})
$('.trading_table').on('click', function () {
//console.log($(this).attr('id'));
  if ($(this).hasClass('sorting') || $(this).hasClass('sorting_asc')) {
    $('.trading_table').removeClass('sorting sorting_asc sorting_desc');
    $('.trading_table').addClass('sorting');
    $(this).removeClass('sorting');
    $(this).addClass('sorting_desc');
  } else {
    $('.trading_table').removeClass('sorting sorting_asc sorting_desc');
    $('.trading_table').addClass('sorting');
    $(this).removeClass('sorting');
    $(this).addClass('sorting_asc');
  }
  getRecord(1);
})