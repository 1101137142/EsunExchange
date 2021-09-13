var now_format = '';
$(function () {
  //設定日期格式遮罩
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();

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
    }
  }, function (start, end, label) {
    //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
  });
  //設定日期區間套件的取消事件
  $('#schRecordDateRange').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  //初始設為空白
  $('#schRecordDateRange').val('');
  getRecord(1);
})
//取得交易紀錄
function getRecord(pageNum) {
  var sch_val = new Object();
  var date = new Object();

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
  console.log(sch_val);
  var url = "index.php?action=TradingRecordAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: { data: sch_val, doTradingRecordAction: 'getExchangeCurrentStatistics' }, // serializes the form's elements.
    success: function (data) {
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
          } else if (v1 == 'cd_code') {
            show_data = v['cd_name'] + '(' + v[v1] + ')';
          } else if (v1 == 'tr_LocalCurrencyTurnover') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalLCT']).toFixed(0) + ')';
            show_data = v[v1];
          } else if (v1 == 'tr_ForeignCurrencyTurnover') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalFCT']).toFixed(v['cd_decimalplaces']) + ')';
            show_data = v[v1];
          } else if (v1 == 'TotalLCT') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalFCT']).toFixed(v['cd_decimalplaces']) + ')';
            show_data = parseFloat(v[v1]).toFixed(0);
          } else if (v1 == 'TotalFCT') {
            //show_data = v[v1] + '(' + parseFloat(v['TotalFCT']).toFixed(v['cd_decimalplaces']) + ')';
            show_data = parseFloat(v[v1]).toFixed(v['cd_decimalplaces']) * 1;
          } else if (v1 == 'cost_rate') {
            if (parseFloat(v['TotalFCT']).toFixed(v['cd_decimalplaces']) < 1) {
              show_data = ' - ';
            } else {
              show_data = Math.abs(parseFloat(parseFloat(v['TotalLCT']).toFixed(0) / parseFloat(v['TotalFCT']).toFixed(v['cd_decimalplaces'])).toFixed(v['cd_decimalplaces']));
            }
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
    },
    error: function (data) {
      //console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}


//排序欄位被點擊時
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


