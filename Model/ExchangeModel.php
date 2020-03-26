<?php

class ExchangeModel extends Model {

  function getExchangeDataByDate($currency, $date) {
    $sql = "SELECT DISTINCT * FROM (SELECT *,HOUR(rd_datetime) H,MINUTE(rd_datetime) M,SECOND(rd_datetime) S FROM `rates_detail` WHERE `rd_currency` = :rd_currency and `rd_datetime` like '" . $date . "%' UNION ALL SELECT *,HOUR(rd_datetime) H,MINUTE(rd_datetime) M,SECOND(rd_datetime) S FROM `rates_tmpdetail` WHERE `rd_currency` = :rd_currency and `rd_datetime` like '" . $date . "%') tmp order by rd_datetime ";
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute(array(':rd_currency' => $currency));
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $row;
  }

  function getExchangeDataByRnage($currency, $date_start, $date_end) {
    $sql = "SELECT * FROM `rates_hl` WHERE `rhl_currency` = :rhl_currency and `rhl_date` between '" . $date_start . "' and '" . $date_end . "'";
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute(array(':rhl_currency' => $currency));
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $row;
  }

  function getExchangeCurrency() {
    $sql = "SELECT DISTINCT rhl_currency FROM `rates_hl` ";
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute();
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $row;
  }

  function getExchangeCurrencyNowRate($TradingCurrency, $TradingTime='') {
    $date = new DateTime($TradingTime);
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://www.esunbank.com.tw/bank/Layouts/esunbank/Deposit/DpService.aspx/GetForeignExchageRate",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{day:'" . $date->format("Y-m-d") . "',time:'" . $date->format("H:i:s") . "'}",
        CURLOPT_HTTPHEADER => array(
            "Host: www.esunbank.com.tw",
            "Content-Length: 34",
            "Accept: application/json, text/javascript, */*; q=0.01",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
            "Content-Type: application/json; charset=UTF-8",
            "Origin: https://www.esunbank.com.tw",
            "Referer: https://www.esunbank.com.tw/bank/personal/deposit/rate/forex/foreign-exchange-rates",
            "Accept-Encoding: gzip, deflate, br",
            "Accept-Language: zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7"
        ),
    ));
    $response = curl_exec($curl);

    curl_close($curl);

    $response = str_replace('\\', '', $response);
    $response = str_replace("{\"d\":\"{\"", "{\"d\":{\"", $response);
    $response = substr($response, 0, -2);
    $response .= "}";
    $response_array = json_decode($response, true);
    $Rate_array = $response_array['d']['Rates'];
    $BBoardRate = null;
    $SBoardRate = null;
    foreach ($Rate_array as $key => $val) {
      /*if ($val["Key"] == $TradingCurrency) {
        $BBoardRate = $val['BBoardRate'];
        $SBoardRate = $val['SBoardRate'];
      }*/
        
        $BoardRate[$val["Key"]]['BBoardRate'] = $val['BuyIncreaseRate'];
        $BoardRate[$val["Key"]]['SBoardRate'] = $val['SellDecreaseRate'];
        //$SBoardRate[$val["Key"]] = $val['SBoardRate'];
    }
    $row = array('TradingTime' => $date->format('Y-m-d H:i:s'), 'BoardRate' => $BoardRate);
    return $row;
  }

  function insExchangeTradingRecord($TradingType, $TradingCurrency, $TradingRate, $LocalCurrencyTurnover, $ForeignCurrencyTurnover) {
    $sql = "INSERT INTO `trading_record`( `tr_type`, `tr_tradingtime`, `tr_currency`, `tr_rate`, `tr_LocalCurrencyTurnover`, `tr_ForeignCurrencyTurnover`)  ";
    $sql .= "VALUES (:TradingType,now(),:TradingCurrency,:TradingRate,:LocalCurrencyTurnover,:ForeignCurrencyTurnover)";
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute(array(':TradingType' => $TradingType, ':TradingCurrency' => $TradingCurrency, ':TradingRate' => $TradingRate, ':LocalCurrencyTurnover' => $LocalCurrencyTurnover, ':ForeignCurrencyTurnover' => $ForeignCurrencyTurnover));
    //$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $status;
  }

}

?>