<?php

class TradingRecordAction implements actionPerformed {

  public function actionPerformed($event) {

    $ExchangeModel = new ExchangeModel();

    $doTradingRecordAction = $_POST["doTradingRecordAction"];
    switch ($doTradingRecordAction) {
      case 'getExchangeCurrency'://取得所有幣別代碼
        $returnData = $ExchangeModel->getExchangeCurrency();
        break;
      case 'getTradingRecordCurrency'://取得有交易紀錄的幣別代碼
        $returnData = $ExchangeModel->getTradingRecordCurrency();
        break;
      
      case 'getExchangeCurrencyNowRate'://取得交易時間當時的匯率
        $TradingCurrency=$_POST['data']['TradingCurrency'];//交易幣別
        $TradingTime=$_POST['data']['TradingTime'];//交易時間
        //$TradingType=$_POST['data']['TradingType'];//交易類型   
        $returnData = $ExchangeModel->getExchangeCurrencyNowRate($TradingCurrency, $TradingTime);
        break;
      
      case 'getExchangeTradingRecord'://取得交易時間當時的匯率
        $TradingCurrency=$_POST['data']['TradingCurrency'];//查詢幣別
        $TradingTime=$_POST['data']['TradingTime'];//交易時間
        $returnData = $ExchangeModel->getExchangeCurrencyNowRate($TradingCurrency, $TradingTime);
        break;
      
      case 'insExchangeTradingRecord':
        //$returnData =$_POST;
        $TradingType=$_POST['data']['TradingType'];//交易類型        
        $TradingTime=$_POST['data']['TradingTime'];//交易時間
        $TradingCurrency=$_POST['data']['TradingCurrency'];//交易幣別
        $TradingRate=$_POST['data']['TradingRate'];//交易匯率
        $LocalCurrencyTurnover=$_POST['data']['LocalCurrencyTurnover'];//本幣增減
        $ForeignCurrencyTurnover=$_POST['data']['ForeignCurrencyTurnover'];//外幣增減
        if($TradingType){
          $LocalCurrencyTurnover=$LocalCurrencyTurnover*-1;
        }else{
          $ForeignCurrencyTurnover=$ForeignCurrencyTurnover*-1;
        }
        $returnData = $ExchangeModel->insExchangeTradingRecord($TradingType,$TradingTime,$TradingCurrency,$TradingRate,$LocalCurrencyTurnover,$ForeignCurrencyTurnover);
        
        break;
    }
    echo json_encode($returnData, true);
  }

}

?>
