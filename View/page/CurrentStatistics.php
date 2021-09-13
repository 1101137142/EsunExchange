
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Current Statistics</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Current Statistics</li>
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
        <!-- 交易表單-E -->
        <div class="card card-info">
          <div class="card-header">
            <h3 class="card-title">外幣交易紀錄</h3>
            <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
              <!--button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button-->
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            
            <!--交易資料列表-->
            <div id="trading_table_wrapper" class="dataTables_wrapper dt-bootstrap4">
              <div class="row">
                <div class="col-sm-12">
                  <table id="trading_table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="trading_table_info">
                    <thead>
                      <tr role="row">                        
                        <th id="trading_table_cd_code" class="trading_table sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" >幣別</th>
                        <th id="trading_table_TotalLCT" class="trading_table sorting_asc" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" >總投入金額</th>
                        <th id="trading_table_TotalFCT" class="trading_table sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" >總外幣金額</th>
                        <th id="trading_table_cost_rate" class="trading_table sorting" tabindex="0" aria-controls="trading_table" rowspan="1" colspan="1" >成本</th>
                      </tr>
                    </thead>
                    <tbody id="trading_table_body">
                      <tr role="row" class="odd">
                        <td class="">Demo</td>
                        <td>Demo</td>
                        <td>Demo</td>
                        <td class="sorting_1">Demo</td>
                        <td>Demo</td>
                      </tr>
                      <tr role="row" class="even">
                        <td class="">Demo</td>
                        <td>Demo</td>
                        <td>Demo</td>
                        <td class="sorting_1">Demo</td>
                        <td>Demo</td>
                      </tr>
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
              
            </div>
          </div>
          <!-- /.card-body -->
        </div>

      </div>
    </div>
    <!-- /.row -->
  </div><!-- /.container-fluid -->
</section>
