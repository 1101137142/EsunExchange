
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Trading Record Ins Form</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Trading Record Ins Form</li>
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
            <h3 class="card-title">Trading Form</h3>
            <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
              <!--button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button-->
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <form role="form">
              <div class="row">
                <div class="col-sm-6">
                  <div class="row">
                    <div class="col-sm-4">
                      <div class="form-group">
                        <label>交易類型</label>
                        <div class="input-group">
                          <select class="custom-select form_ins_val notnull" id="TradingType">
                            <option value=""></option>
                            <option value="1">買</option>
                            <option value="0">賣</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="col-sm-8">
                      <div class="form-group">
                        <label>交易時間</label>
                        <div class="input-group">
                          <input type="text" class="form-control form_ins_val" name="TradingTime"  id="TradingTime" placeholder="交易時間" data-fname="交易時間" >
                          <div class="input-group-prepend">
                            <button type="button" class="btn btn-success" onclick="setTime()">Now</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="row">
                    <div class="col-sm-5">
                      <div class="form-group">
                        <label>幣別</label>
                        <div class="input-group">
                          <select class="custom-select form_ins_val notnull" id="TradingCurrency">
                            <option value=""></option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-7">
                      <div class="form-group">
                        <label>匯率</label>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text">$</span>
                          </div>
                          <input type="text" id="TradingRate" class="form-control form_ins_val notnull" placeholder="匯率">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>台幣交易額</label>
                    <input type="text" id="LocalCurrencyTurnover"  class="form-control form_ins_val notnull" placeholder="台幣交易額">
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label>外幣交易額</label>
                    <input type="text" id="ForeignCurrencyTurnover"  class="form-control form_ins_val notnull" placeholder="外幣交易額">
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary" onclick="saveform()">送出</button>
            <button type="reset" class="btn btn-default float-right" onclick="reset()">重設</button>
          </div>
        </div>
        <!-- 交易表單-E -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">DataTable with minimal features &amp; hover style</h3>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-3  col-sm-1 col-1">
                <label id="today_gap"></label>
              </div>
              <!--div class="col-lg-3 offset-lg-9 col-md-5 offset-md-7 col-sm-7 offset-sm-5 col-9"-->
              <div class="col-lg-6 col-md-9 col-sm-11 col-11">
                <div class="col-xs-12 text-right input-group justify-content-end">
                  <select class="custom-select schRecordForm" id="schRecordCurrency" >
                    <option value=""></option>
                  </select>
                  <input type="text" class="form-control f_input schRecordForm" name="schRecordDateRange"  id="schRecordDateRange" placeholder="日期區間" data-fname="日期區間" >
                </div>
              </div>
            </div>
           <!--交易資料列表-->
            <div id="trading_table_wrapper" class="dataTables_wrapper dt-bootstrap4">
              <div class="row">
                <div class="col-sm-12">
                  <table id="trading_table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="trading_table_info">
                    <thead>
                      <tr role="row">
                        <th class="sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" aria-label="Rendering engine: activate to sort column ascending">買/賣</th>
                        <th class="sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" aria-label="Browser: activate to sort column ascending">幣別</th>
                        <th class="sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" aria-label="Platform(s): activate to sort column ascending">本幣金額</th>
                        <th class="sorting_desc" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" aria-label="Engine version: activate to sort column ascending" aria-sort="descending">外幣金額</th>
                        <th class="sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" aria-label="CSS grade: activate to sort column ascending">匯率</th>
                      </tr>
                    </thead>
                    <tbody id="trading_table_body">
                      <tr role="row" class="odd">
                        <td class="">Webkit</td>
                        <td>Safari 3.0</td>
                        <td>OSX.4+</td>
                        <td class="sorting_1">522.1</td>
                        <td>A</td>
                      </tr>
                      <tr role="row" class="even">
                        <td class="">Webkit</td>
                        <td>iPod Touch / iPhone</td>
                        <td>iPod</td>
                        <td class="sorting_1">420.1</td>
                        <td>A</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr><th rowspan="1" colspan="1">買/賣</th>
                        <th rowspan="1" colspan="1">幣別</th>
                        <th rowspan="1" colspan="1">本幣金額</th>
                        <th rowspan="1" colspan="1">外幣金額</th>
                        <th rowspan="1" colspan="1">匯率</th></tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-5">
                  <div class="dataTables_info" id="trading_table_info" role="status" aria-live="polite">Showing 1 to 10 of 57 entries</div>
                </div>
                <div class="col-sm-12 col-md-7">
                  <div class="dataTables_paginate paging_simple_numbers" id="trading_table_paginate">
                    <ul class="pagination">
                      <li class="paginate_button page-item previous disabled" id="trading_table_previous">
                        <a href="#" aria-controls="trading_table" data-dt-idx="0" tabindex="0" class="page-link">Previous</a>
                      </li>
                      <li class="paginate_button page-item active"><a href="#" aria-controls="trading_table" data-dt-idx="1" tabindex="0" class="page-link">1</a></li>
                     <li class="paginate_button page-item active">...</li> 
                      <li class="paginate_button page-item "><a href="#" aria-controls="trading_table" data-dt-idx="2" tabindex="0" class="page-link">2</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="trading_table" data-dt-idx="3" tabindex="0" class="page-link">3</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="trading_table" data-dt-idx="4" tabindex="0" class="page-link">4</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="trading_table" data-dt-idx="5" tabindex="0" class="page-link">5</a></li>
                      <li class="paginate_button page-item "><a href="#" aria-controls="trading_table" data-dt-idx="6" tabindex="0" class="page-link">6</a></li>
                      <li class="paginate_button page-item next" id="trading_table_next"><a href="#" aria-controls="trading_table" data-dt-idx="7" tabindex="0" class="page-link">Next</a></li>
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
