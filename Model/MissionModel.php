<?php

class MissionModel extends Model
{
  function insShortTermMission($income_data)
  {
    $ms_stm_name = $income_data['ms_stm_name'];
    $ms_stm_score = $income_data['ms_stm_score'];
    $ms_stm_starttime = $income_data['ms_stm_starttime'];
    $ms_stm_endtime = $income_data['ms_stm_endtime'];
    $ms_stm_type = $income_data['ms_stm_type'];
    $ms_stm_period = $income_data['ms_stm_period'];
    $ms_stm_periodunit = $income_data['ms_stm_periodunit'];
    $ms_stm_describe = $income_data['ms_stm_describe'];

    //ms_stm_refreshtime 初始值設為任務開始日 , ms_stm_status初始值設為0(未完成)
    $sql = "INSERT INTO `ms_shortterm_mission`(`ms_stm_name`, `ms_stm_describe`, `ms_stm_score`, `ms_stm_type`, `ms_stm_status`, `ms_stm_starttime`, `ms_stm_endtime`, 
    `ms_stm_period`, `ms_stm_periodunit`, `ms_stm_refreshtime`) 
    VALUES (:ms_stm_name,:ms_stm_describe,:ms_stm_score,:ms_stm_type,:ms_stm_status,:ms_stm_starttime,:ms_stm_endtime,:ms_stm_period,:ms_stm_periodunit,:ms_stm_starttime)";
    $stmt = $this->cont->prepare($sql);
    $status = $stmt->execute(array(
      ':ms_stm_name' => $ms_stm_name, ':ms_stm_describe' => $ms_stm_describe, ':ms_stm_score' => $ms_stm_score, ':ms_stm_type' => $ms_stm_type,
      ':ms_stm_status' => '0', ':ms_stm_starttime' => $ms_stm_starttime, ':ms_stm_endtime' => $ms_stm_endtime, ':ms_stm_period' => $ms_stm_period,
      ':ms_stm_periodunit' => $ms_stm_periodunit
    ));

    return $status;
  }
  function updShortTermMission($income_data)
  {
    $ms_stm_id = $income_data['ms_stm_id'];
    $ms_stm_name = $income_data['ms_stm_name'];
    $ms_stm_score = $income_data['ms_stm_score'];
    $ms_stm_status = $income_data['ms_stm_status'];
    $ms_stm_starttime = $income_data['ms_stm_starttime'];
    $ms_stm_endtime = $income_data['ms_stm_endtime'];
    $ms_stm_period = $income_data['ms_stm_period'];
    $ms_stm_periodunit = $income_data['ms_stm_periodunit'];
    $ms_stm_describe = $income_data['ms_stm_describe'];

    //ms_stm_refreshtime 初始值設為任務開始日 , ms_stm_status初始值設為0(未完成)
    $sql = "UPDATE `ms_shortterm_mission` SET `ms_stm_name`=:ms_stm_name,`ms_stm_describe`=:ms_stm_describe,
    `ms_stm_score`=:ms_stm_score,`ms_stm_status`=:ms_stm_status,`ms_stm_starttime`=:ms_stm_starttime,
    `ms_stm_endtime`=:ms_stm_endtime,`ms_stm_period`=:ms_stm_period,`ms_stm_periodunit`=:ms_stm_periodunit WHERE ms_stm_id=:ms_stm_id";
    $stmt = $this->cont->prepare($sql);
    $status = $stmt->execute(array(
      ':ms_stm_name' => $ms_stm_name, ':ms_stm_describe' => $ms_stm_describe, ':ms_stm_score' => $ms_stm_score,
      ':ms_stm_status' => $ms_stm_status, ':ms_stm_starttime' => $ms_stm_starttime, ':ms_stm_endtime' => $ms_stm_endtime, ':ms_stm_period' => $ms_stm_period,
      ':ms_stm_periodunit' => $ms_stm_periodunit, ':ms_stm_id' => $ms_stm_id
    ));

    return $status;
  }
  //取得短期目標清單
  //ms_stm_type 任務類型,ms_stm_status 任務狀態,orderby 要排序的欄位名稱,Inverted 排序方式,pageNum 要顯示的頁數
  function getShortTermMission($income_data)
  {
    //return $income_data;
    $ms_stm_type = $income_data['ms_stm_type'];
    $ms_stm_status = $income_data['ms_stm_status'];
    $orderby = $income_data['orderby'];
    $Inverted = $income_data['Inverted'];
    $pageNum = $income_data['pageNum'];

    $sqlWhere = "ms_stm_type = '" . $ms_stm_type . "'";

    if ($ms_stm_status != '') {
      if ($sqlWhere != '') {
        $sqlWhere .= ' and ';
      }
      $sqlWhere .= " ms_stm_status= '" . $ms_stm_status . "'";
    }

    if ($ms_stm_status != '9') {
      if ($sqlWhere != '') {
        $sqlWhere .= ' and ';
      }
      $sqlWhere .= " ms_stm_status<> '9'";
    }

    //$status = $sqlWhere;
    $firstData = ($pageNum - 1) * 10;
    $sqlCount = "SELECT * FROM `ms_shortterm_mission` WHERE " . $sqlWhere . " ";
    $stmtCount = $this->cont->prepare($sqlCount);
    //return $sqlCount;
    $status[] = $stmtCount->execute();
    $rowcount = $stmtCount->rowCount();
    
    if($orderby=='ms_stm_period'){
      $sql = "SELECT * FROM `ms_shortterm_mission` WHERE " . $sqlWhere . " ORDER BY ms_stm_periodunit $Inverted,$orderby $Inverted,ms_stm_id $Inverted limit $firstData,10";
    }else{
      $sql = "SELECT * FROM `ms_shortterm_mission` WHERE " . $sqlWhere . " ORDER BY $orderby $Inverted,ms_stm_id $Inverted limit $firstData,10";
    }    
    //$row = $sql;
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute();
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $data['row'] = $row;
    $data['rowcount'] = $rowcount;
    return $data;
  }
  function getShortTermMissionByID($income_data)
  {
    $ms_stm_id = $income_data['ms_stm_id'];
    $sqlWhere = "ms_stm_id = '" . $ms_stm_id . "'";

    $sql = "SELECT * FROM `ms_shortterm_mission` WHERE " . $sqlWhere . "";
    //$row = $sql;
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute();
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $data['row'] = $row;
    return $data;
  }
  function delShortTermMissionByID($income_data)
  {
    $ms_stm_id = $income_data['ms_stm_id'];
    $sqlWhere = "ms_stm_id = '" . $ms_stm_id . "'";

    $sql = "UPDATE `ms_shortterm_mission` SET `ms_stm_status`='9' WHERE " . $sqlWhere . "";
    //$row = $sql;
    $stmt = $this->cont->prepare($sql);
    $status[] = $stmt->execute();
    return $status;
  }
}
