<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Short Term Goal</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Short Term Goal</li>
        </ol>
      </div>
    </div>
  </div><!-- /.container-fluid -->
</section>

<!-- Main content -->
<section class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <!-- 交易表單-S -->
        <div class="card card-primary">
          <div class="card-header">
            <h3 class="card-title">Short Term Goal Ins Form</h3>
            <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
              <!--button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button-->
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <form role="form">
              <div class="row">
                <div class="col-sm-12">
                  <div class="row">
                    <div class="col-sm-8">
                      <div class="form-group">
                        <label>任務名稱</label>
                        <div class="input-group">
                          <input type="hidden" class="form-control form_ins_val notnull" name="ms_stm_action" id="ms_stm_action" placeholder="表單動作">
                          <!--INS新增 UPD修改-->
                          <input type="hidden" class="form-control form_ins_val " name="ms_stm_id" id="ms_stm_id" placeholder="任務編號">
                          <input type="text" class="form-control form_ins_val notnull" name="ms_stm_name" id="ms_stm_name" placeholder="任務名稱">
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-2">
                      <div class="form-group">
                        <label>任務分數</label>
                        <div class="input-group">
                          <input type="text" class="form-control form_ins_val" name="ms_stm_score" id="ms_stm_score" placeholder="任務分數" data-fname="任務分數">
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-2">
                      <div class="form-group">
                        <label>任務狀態</label>
                        <div class="input-group">
                          <select class="custom-select form_ins_val notnull" id="ms_stm_status">
                            <option value=""></option>
                            <option value="0">未完成</option>
                            <option value="1">完成</option>
                            <option value="2">結束</option>
                            <option value="3">失敗</option>
                            <option value="9">刪除</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="row">

                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="row">
                    <div class="col-sm-3">
                      <label>起始時間</label>
                      <div class="input-group">
                        <input type="text" class="form-control form_ins_val" name="ms_stm_starttime" id="ms_stm_starttime" placeholder="起始時間" data-fname="起始時間">
                        <div class="input-group-prepend">
                          <button type="button" class="btn btn-success" onclick="setTime('ms_stm_starttime')">Now</button>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <label>結束時間</label>
                      <div class="input-group">
                        <input type="text" class="form-control form_ins_val" name="ms_stm_endtime" id="ms_stm_endtime" placeholder="結束時間" data-fname="結束時間">
                        <div class="input-group-prepend">
                          <button type="button" class="btn btn-success" onclick="setTime('ms_stm_endtime')">Now</button>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="form-group">
                        <label>任務類型</label>
                        <div class="input-group">
                          <select class="custom-select form_ins_val notnull" id="ms_stm_type">
                            <option value=""></option>
                            <option value="1">一次性</option>
                            <option value="2">重複性</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="form-group">
                        <label>重複週期</label>
                        <div class="input-group">
                          <input type="text" class="form-control form_ins_val notnull" name="ms_stm_period" id="ms_stm_period">
                          <select class="custom-select form_ins_val notnull" id="ms_stm_periodunit">
                            <option value=""></option>
                            <option value="1">分鐘</option>
                            <option value="2">小時</option>
                            <option value="3">天</option>
                            <option value="4">周</option>
                            <option value="5">月</option>
                            <option value="6">年</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="form-group">
                    <label>任務描述</label>
                    <textarea class="form-control form_ins_val notnull" rows="3" name="ms_stm_describe" id="ms_stm_describe" placeholder="在此輸入詳細任務內容描述..."></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="card-footer">
            <div class="btn-group float-right">
              <button type="button" class="btn btn-primary " onclick="saveform()">送出</button>
              <button type="button" class="btn btn-default " onclick="reset()">重設</button>
            </div>
          </div>
        </div>
        <!-- 交易表單-E -->
        <div class="card  card-info">
          <div class="card-header">
            <h3 class="card-title">任務清單</h3>
            <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
              <!--button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button-->
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <div class="col-sm-2 col-2">
                <button type="button" class="btn btn-block bg-gradient-primary" id="btnMissionCreate"><i class="far fa-plus-square"></i>新建任務</button>
              </div>
              <!--div class="col-lg-3 offset-lg-9 col-md-5 offset-md-7 col-sm-7 offset-sm-5 col-9"-->
              <div class="col-sm-10 col-10">
                <div class="col-xs-12 text-right input-group justify-content-end">
                  <select class="custom-select schMissionForm" id="schMissionStatus">
                    <option value=""></option>
                    <option value="0">未完成</option>
                    <option value="1">完成</option>
                    <option value="2">結束</option>
                    <option value="3">失敗</option>
                    <option value="9">刪除</option>
                  </select>
                  <!--input type="text" class="form-control f_input schMissionForm" name="schMissionDateRange" id="schMissionDateRange" placeholder="日期區間" data-fname="日期區間"-->
                </div>
              </div>
            </div>
            <!--交易資料列表-->
            <div id="ms_short_table_wrapper" class="dataTables_wrapper dt-bootstrap4">
              <div class="row">
                <div class="col-sm-12">
                  <table id="ms_short_table" class="table  table-hover dataTable" role="grid" aria-describedby="ms_short_table_info">
                    <thead>
                      <tr role="row">
                        <th id="ms_short_table_edit" class="ms_short_table no_sort" aria-controls="ms_short_table" rowspan="1" colspan="1">操作</th>
                        <th id="ms_short_table_ms_stm_name" class="ms_short_table no_sort" aria-controls="ms_short_table" rowspan="1" colspan="1">任務名稱</th>
                        <th id="ms_short_table_ms_stm_score" class="ms_short_table sorting" aria-controls="ms_short_table" rowspan="1" colspan="1">分數</th>
                        <th id="ms_short_table_ms_stm_period" class="ms_short_table sorting" aria-controls="ms_short_table" rowspan="1" colspan="1">週期</th>
                        <th id="ms_short_table_ms_stm_status" class="ms_short_table sorting" aria-controls="ms_short_table" rowspan="1" colspan="1">目前狀態</th>
                        <th id="ms_short_table_ms_stm_starttime" class="ms_short_table sorting" aria-controls="ms_short_table" rowspan="1" colspan="1">開始時間</th>
                        <th id="ms_short_table_ms_stm_endtime" class="ms_short_table sorting" aria-controls="ms_short_table" rowspan="1" colspan="1">結束時間</th>
                        <th id="ms_short_table_ms_stm_createtime" class="ms_short_table sorting_desc" aria-controls="ms_short_table" rowspan="1" colspan="1">建立時間</th>
                      </tr>
                    </thead>
                    <tbody id="ms_short_table_body">

                      <tr role="row" class="odd">
                        <td class="">-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="sorting_1">-</td>
                        <td>-</td>
                      </tr>
                      <!--tr role="row" class="even">
                        <td class="">Demo</td>
                        <td>Demo</td>
                        <td>Demo</td>
                        <td class="sorting_1">Demo</td>
                        <td>Demo</td>
                      </tr-->
                    </tbody>
                    <!--tfoot>
                      <tr><th rowspan="1" colspan="1">買/賣</th>
                        <th rowspan="1" colspan="1">幣別</th>
                        <th rowspan="1" colspan="1">本幣金額</th>
                        <th rowspan="1" colspan="1">外幣金額</th>
                        <th rowspan="1" colspan="1">匯率</th>
                        <th rowspan="1" colspan="1">交易時間</th></tr>
                    </tfoot-->
                  </table>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-5">
                  <div class="dataTables_info" id="ms_short_table_info" role="status" aria-live="polite">Showing 1 to 10 of 0 entries</div>
                </div>
                <div class="col-sm-12 col-md-7">
                  <div class="dataTables_paginate paging_simple_numbers" id="ms_short_table_paginate">
                    <ul class="pagination">
                      <li class="paginate_button page-item previous disabled" id="ms_short_table_previous">
                        <a href="#" aria-controls="ms_short_table" data-dt-idx="0" class="page-link">Previous</a>
                      </li>
                      <li class="paginate_button page-item active"><a href="#" aria-controls="ms_short_table" data-dt-idx="1" class="page-link">1</a></li>
                      <li class="paginate_button page-item ">...</li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="ms_short_table" data-dt-idx="2" class="page-link">2</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="ms_short_table" data-dt-idx="3" class="page-link">3</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="ms_short_table" data-dt-idx="4" class="page-link">4</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="ms_short_table" data-dt-idx="5" class="page-link">5</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="ms_short_table" data-dt-idx="6" class="page-link">6</a></li>
                      <li class="paginate_button page-item next" id="ms_short_table_next"><a href="#" aria-controls="ms_short_table" data-dt-idx="7" class="page-link">Next</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /.card-body -->
        </div>

      </div>
    </div>
    <!-- /.row -->
  </div><!-- /.container-fluid -->
</section>