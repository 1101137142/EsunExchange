<?php

class ExchangeDataAction implements actionPerformed {

  public function actionPerformed($event) {

    $ExchangeModel = new ExchangeModel();

    $doExchangeAction = $_POST["doExchangeAction"];
    
    $currency = $_POST["currency"];
    $date = $_POST["date"];
    switch ($doExchangeAction) {
      /*case 'buyExchange':
        //$returnData = $ShopModel->buyExchange($ExchangeID);
        break;
      case 'unbuyExchange':
        //$returnData = $ShopModel->unbuyExchange($ExchangeID);
        break;
      case 'EditExchange':
        //$returnData = $ShopModel->selectEditExchange($ExchangeID)->fetch(PDO::FETCH_ASSOC);
        break;
      case 'doEditExchange':
        //$returnData = $ShopModel->doEditExchange($event->getPost());
        break;
      case 'doCreateExchange':
        //$returnData = $ShopModel->doCreateExchange($event->getPost());
        break;*/
      case 'getExchangeDataByDay':
        $returnData = $ExchangeModel->getExchangeDataByDate($currency,$date);
        //$returnData=[$currency,$date];
        break;
      case 'getExchangeDataByRange':
        $returnData = $ExchangeModel->getExchangeDataByRnage($currency,$date[0],$date[1]);
        break;
    }
    echo json_encode($returnData, true);
  }

}

?>
