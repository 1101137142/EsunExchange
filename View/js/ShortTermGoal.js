var now_format = '';
$(function () {
  //設定日期格式遮罩
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('#ms_stm_starttime,#ms_stm_endtime').daterangepicker({
    "singleDatePicker": true,
    "timePicker": true,
    "timePicker24Hour": true,
    "timePickerSeconds": true,
    "startDate": now_format,
    "autoApply": true,
    locale: {
      format: 'YYYY-MM-DD HH:mm:ss',
      cancelLabel: 'Clear'
    }
  }, function (start, end, label) {
    //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
  });
  //任務結束時間預設留空
  $('#ms_stm_endtime').val('');
  //設定日期欄位清除功能
  $('#ms_stm_starttime,#ms_stm_endtime').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  //先收起任務新增修改表單
  $('.content button').eq(0).click();
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
  console.log(ins_val);
  var doMissionAction = '';
  var FinishAlert = '';
  if ($('#ms_stm_action').val() == 'INS') {
    doMissionAction = 'insShortTermMission';
    FinishAlert = '新增完成';
  } else if ($('#ms_stm_action').val() == 'UPD') {
    doMissionAction = 'updShortTermMission';
    FinishAlert = '修改完成';
  }
  //return false;
  var url = "index.php?action=MissionAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: { data: ins_val, doMissionAction: doMissionAction }, // serializes the form's elements.
    success: function (data) {
      console.log(data);
      if (data) {
        alert(FinishAlert);
        reset();

        $('.content button').eq(0).click();
        getRecord(1);
      }
    },
    error: function (data) {
      console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}
//取得任務清單
function getRecord(pageNum) {
  var sch_val = new Object();
  sch_val['ms_stm_status'] = $('#schMissionStatus').val();
  sch_val['ms_stm_type'] = '2';
  $.each($('.ms_short_table'), function (k, v) {
    if (!$(this).hasClass('sorting')) {
      if ($(this).hasClass('sorting_asc')) {
        sch_val['orderby'] = $(this).attr('id').replace("ms_short_table_", "");
        sch_val['Inverted'] = 'asc';
      } else if ($(this).hasClass('sorting_desc')) {
        sch_val['orderby'] = $(this).attr('id').replace("ms_short_table_", "");
        sch_val['Inverted'] = 'desc';
      }
    }
  })
  sch_val['pageNum'] = pageNum;
  console.log(sch_val);
  var url = "index.php?action=MissionAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: { data: sch_val, doMissionAction: 'getShortTermMission' }, // serializes the form's elements.
    success: function (data) {
      console.log(data);
      var count_data = 0;
      var ms_short_table_body_html = '';
      var table_field = new Array();
      $.each($('.ms_short_table'), function (k, v) {
        table_field[k] = $(this).attr('id').replace("ms_short_table_", "");
      })
      $.each(data['row'], function (k, v) {

        if (count_data % 2 == 0) {
          ms_short_table_body_html += '<tr role="row" class="odd">';
        } else {
          ms_short_table_body_html += '<tr role="row" class="even">';
        }
        var show_data = '';
        $.each(table_field, function (k1, v1) {
          if (v1 == 'edit') {
            show_data = '<div class="btn-group">';
            show_data += '<button type="button" class="btn btn-default" onclick="editMission(' + v['ms_stm_id'] + ')"><i class="far fa-edit"></i></button>';
            show_data += '<button type="button" class="btn btn-default" onclick="delMission(' + v['ms_stm_id'] + ')"><i class="far fa-trash-alt"></i></button>';
            show_data += '</div>';
          } else if (v1 == 'ms_stm_status') {
            switch (v[v1]) {
              case '0':
                show_data = '未完成';
                break;
              case '1':
                show_data = '完成';
                break;
              case '2':
                show_data = '結束';
                break;
              case '3':
                show_data = '失敗';
                break;
              case '9':
                show_data = '刪除';
                break;
            }
          } else if (v1 == 'ms_stm_period') {
            show_data = v[v1];
            switch (v['ms_stm_periodunit']) {
              case '1':
                show_data += '分鐘';
                break;
              case '2':
                show_data += '小時';
                break;
              case '3':
                show_data += '天';
                break;
              case '4':
                show_data += '周';
                break;
              case '5':
                show_data += '月';
                break;
              case '6':
                show_data += '年';
                break;
            }
            
          } else {
            show_data = v[v1];
          }
          ms_short_table_body_html += '<td>' + show_data + '</td>';
        })

        count_data++;
      })
      //console.log(ms_short_table_body_html);
      console.log(data['rowcount']);
      $('#ms_short_table_body').html(ms_short_table_body_html);
      var max_page = Math.ceil(data['rowcount'] / 10);
      console.log(max_page);
      //設定頁尾頁數連結

      var pagination_html = '';
      var isNowPage = '';
      //如果總頁數不超過五頁 直接列出
      if (max_page < 6) {
        if (max_page < 1) {
          pagination_html += ' <li class="paginate_button page-item" onclick="getRecord(1)" >';
          pagination_html += ' <a href="#" aria-controls="ms_short_table" data-dt-idx="1" tabindex="0" class="page-link">1</a></li>';
        }
        for (var i = 1; i <= max_page; i++) {
          pagination_html += ' <li class="paginate_button page-item ';
          if (i == pageNum) {
            pagination_html += ' active ';
          } else {
            pagination_html += '" onclick="getRecord(' + i + ')';
          }
          pagination_html += ' "><a href="#" aria-controls="ms_short_table" data-dt-idx="' + i + '" tabindex="0" class="page-link">' + i + '</a></li>';
        }
      } else {
        //如果超過五頁 判斷現在頁數是不是大於第三頁 是的話需要做省略
        if (pageNum > 3) {
          pagination_html += '<li class="paginate_button page-item previous " id="ms_short_table_previous" onclick="getRecord(' + (pageNum - 1) + ')"> <a href="#" data-dt-idx="0" tabindex="0" class="page-link">Previous</a> </li>';
          pagination_html += '<li class="paginate_button page-item "  onclick="getRecord(1)"><a href="#"  data-dt-idx="1" tabindex="0" class="page-link">1</a></li>';
          if (pageNum > 4) {
            pagination_html += '<li class="paginate_button page-item ">...</li> ';
          }
        } else if (pageNum != '1') {
          pagination_html += '<li class="paginate_button page-item previous " id="ms_short_table_previous" onclick="getRecord(' + (pageNum - 1) + ')"> <a href="#" data-dt-idx="0" tabindex="0" class="page-link">Previous</a> </li>';
        }
        //此部分是中間頁數判斷 如果現在頁面扣掉必須要顯示的兩頁會造成溢位 那就需要減少顯示的頁數(現在頁數為1 則顯示3頁  2為4頁)
        if (pageNum - 2 < 1) {
          for (var i = 0; i < pageNum + 2; i++) {
            isNowPage = '';
            if (pageNum == parseInt(i + 1)) {
              isNowPage = ' active ';
            }
            pagination_html += '<li class="paginate_button page-item ' + isNowPage + '" ><a href="#" onclick="getRecord(' + parseInt(i + 1) + ')" aria-controls="ms_short_table" data-dt-idx="' + parseInt(i + 1) + '" tabindex="0" class="page-link">' + parseInt(i + 1) + '</a></li>'
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
            pagination_html += '<li class="paginate_button page-item' + isNowPage + ' " onclick="getRecord(' + hrefPageNum + ')"><a href="#" aria-controls="ms_short_table" data-dt-idx="' + hrefPageNum + '" tabindex="0" class="page-link">' + hrefPageNum + '</a></li>';
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
            pagination_html += '<li class="paginate_button page-item' + isNowPage + ' " onclick="getRecord(' + hrefPageNum + ')"><a href="#" aria-controls="ms_short_table" data-dt-idx="' + hrefPageNum + '" tabindex="0" class="page-link">' + hrefPageNum + '</a></li>'
          }
          console.log(pagination_html);
        }
        if (pageNum < max_page - 2) {
          if (pageNum < max_page - 3) {
            pagination_html += '<li class="paginate_button page-item ">...</li> ';
          }
          pagination_html += '<li class="paginate_button page-item "  onclick="getRecord(' + max_page + ')" ><a href="#"  data-dt-idx="' + max_page + '" tabindex="0" class="page-link">' + max_page + '</a></li>';
          pagination_html += '<li class="paginate_button page-item next" id="ms_short_table_next"  onclick="getRecord(' + parseInt(pageNum + 1) + ')" ><a href="#" aria-controls="ms_short_table" data-dt-idx="7" tabindex="0" class="page-link">Next</a></li>';
        } else if (pageNum != max_page) {
          pagination_html += '<li class="paginate_button page-item next" id="ms_short_table_next"  onclick="getRecord(' + parseInt(pageNum + 1) + ')" ><a href="#" aria-controls="ms_short_table" data-dt-idx="7" tabindex="0" class="page-link">Next</a></li>';
        }

      }
      $('#ms_short_table_info').html('Showing ' + parseInt((pageNum - 1) * 10 + 1) + ' to ' + pageNum * 10 + ' of ' + data['rowcount'] + ' entries');
      $('.pagination').html(pagination_html);
    },
    error: function (data) {
      //console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}
function editMission(ms_stm_id) {
  var sch_val = new Object();
  sch_val['ms_stm_id'] = ms_stm_id;
  var url = "index.php?action=MissionAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: { data: sch_val, doMissionAction: 'getShortTermMissionByID' }, // serializes the form's elements.
    success: function (data) {
      reset();
      $('#ms_stm_type').attr('disabled', true);
      if ($('.content button').eq(0).find('i').hasClass('fa-plus')) {
        $('.content button').eq(0).click();
      }
      $('#ms_stm_action').val('UPD');
      $.each(data['row'][0], function (k, v) {
        console.log(k + ':' + v);
        $('#' + k).val(v);
      });
    },
    error: function (data) {
      //console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}
function delMission(ms_stm_id) {
  if (!confirm('確定要刪除嗎?')) {
    return 0;
  }
  var sch_val = new Object();
  sch_val['ms_stm_id'] = ms_stm_id;
  var url = "index.php?action=MissionAction";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: { data: sch_val, doMissionAction: 'delShortTermMissionByID' }, // serializes the form's elements.
    success: function (data) {
      alert('刪除完成');
      console.log(data);
      getRecord(1);
    },
    error: function (data) {
      //console.log(ins_val);
      console.log('An error occurred.');
      console.log(data);
    }
  });
}
//重設任務表單
function reset() {
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('.form_ins_val').val('');
  $('.form_ins_val').attr('disabled', false);
  $('#ms_stm_starttime').val(now_format);
  $('#ms_stm_action').val('INS');
}
//設定欄位為現在時間
function setTime(field_name) {
  var now = new Date();
  now_format = now.getFullYear() + "-" + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? '0' : '') + (now.getDate()) + " " + (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
  $('#' + field_name).val(now_format);
}

$('#btnMissionCreate').on('click', function () {
  reset();
  if ($('.content button').eq(0).find('i').hasClass('fa-plus')) {
    $('.content button').eq(0).click();
  }
  $('#ms_stm_action').val('INS');
})
$('#schMissionStatus').on('change', function () {

  getRecord(1);
  if ($('#schMissionStatus').val() != '') {
  }
  //console.log($(this).val());
})


$('.ms_short_table').not('.no_sort').on('click', function () {
  //console.log($(this).attr('id'));
  if ($(this).hasClass('sorting') || $(this).hasClass('sorting_asc')) {
    $('.ms_short_table').not('.no_sort').removeClass('sorting sorting_asc sorting_desc');
    $('.ms_short_table').not('.no_sort').addClass('sorting');
    $(this).removeClass('sorting');
    $(this).addClass('sorting_desc');
  } else {
    $('.ms_short_table').not('.no_sort').removeClass('sorting sorting_asc sorting_desc');
    $('.ms_short_table').not('.no_sort').addClass('sorting');
    $(this).removeClass('sorting');
    $(this).addClass('sorting_asc');
  }
  getRecord(1);
})