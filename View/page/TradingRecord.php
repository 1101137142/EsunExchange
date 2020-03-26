
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
        <div class="card card-primary">
          <div class="card-header">
            <h3 class="card-title">Trading Form</h3>
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
          <!-- /.card-body -->
          <div class="card-footer">
            <button type="button" class="btn btn-primary" onclick="saveform()">送出</button>
            <button type="reset" class="btn btn-default float-right" onclick="reset()">重設</button>
          </div>
        </div>

      </div>
    </div>
    <!-- /.row -->
  </div><!-- /.container-fluid -->
</section>