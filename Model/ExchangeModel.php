<?php

class ExchangeModel extends Model {
    function getExchangeDataByDate($currency,$date){
        $sql = "SELECT DISTINCT * FROM (SELECT *,HOUR(rd_datetime) H,MINUTE(rd_datetime) M,SECOND(rd_datetime) S FROM `rates_detail` WHERE `rd_currency` = :rd_currency and `rd_datetime` like '".$date."%' UNION ALL SELECT *,HOUR(rd_datetime) H,MINUTE(rd_datetime) M,SECOND(rd_datetime) S FROM `rates_tmpdetail` WHERE `rd_currency` = :rd_currency and `rd_datetime` like '".$date."%') tmp order by rd_datetime ";
        $stmt = $this->cont->prepare($sql);
        $status[] = $stmt->execute(array(':rd_currency'=>$currency));
        $row=$stmt->fetchAll(PDO::FETCH_ASSOC);
        return $row;
    }
    function getExchangeDataByRnage($currency,$date_start,$date_end){
        $sql = "SELECT * FROM `rates_hl` WHERE `rhl_currency` = :rhl_currency and `rhl_date` between '".$date_start."' and '".$date_end."'";
        $stmt = $this->cont->prepare($sql);
        $status[] = $stmt->execute(array(':rhl_currency'=>$currency));
        $row=$stmt->fetchAll(PDO::FETCH_ASSOC);
        return $row;
    }
}
