<?php

class TradingRecordAction implements actionPerformed {

  public function actionPerformed($event) {

    $ExchangeModel = new ExchangeModel();

    $doExchangeAction = $_POST["doExchangeAction"];
    switch ($doExchangeAction) {
      case 'getExchangeCurrency':
        $returnData = $ExchangeModel->getExchangeCurrency();
        break;
      
      case 'getExchangeCurrencyNowRate':
        $TradingCurrency=$_POST['data']['TradingCurrency'];//交易幣別
        $TradingTime=$_POST['data']['TradingTime'];//交易時間
        //$TradingType=$_POST['data']['TradingType'];//交易類型   
        $returnData = $ExchangeModel->getExchangeCurrencyNowRate($TradingCurrency, $TradingTime);
        break;
      
      case 'insExchangeTradingRecord':
        //$returnData =$_POST;
        $TradingType=$_POST['data']['TradingType'];//交易類型        
        $TradingCurrency=$_POST['data']['TradingCurrency'];//交易幣別
        $TradingRate=$_POST['data']['TradingRate'];//交易匯率
        $LocalCurrencyTurnover=$_POST['data']['LocalCurrencyTurnover'];//本幣增減
        $ForeignCurrencyTurnover=$_POST['data']['ForeignCurrencyTurnover'];//外幣增減
        if($TradingType){
          $LocalCurrencyTurnover=$LocalCurrencyTurnover*-1;
        }else{
          $ForeignCurrencyTurnover=$ForeignCurrencyTurnover*-1;
        }
        $returnData = $ExchangeModel->insExchangeTradingRecord($TradingType,$TradingCurrency,$TradingRate,$LocalCurrencyTurnover,$ForeignCurrencyTurnover);
        
        break;
    }
    echo json_encode($returnData, true);
  }

}

?>
