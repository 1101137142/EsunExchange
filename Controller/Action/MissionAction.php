<?php

class MissionAction implements actionPerformed
{

  public function actionPerformed($event)
  {
    require_once 'Model/MissionModel.php';
    $MissionModel = new MissionModel();

    $doMissionAction = $_POST["doMissionAction"];
    switch ($doMissionAction) {
      case 'insShortTermMission': //建立短期目標
        $returnData = $MissionModel->insShortTermMission($_POST["data"]);
        break;
      case 'getShortTermMission': //查詢短期目標清單
        $returnData = $MissionModel->getShortTermMission($_POST["data"]);
        break;
      case 'updShortTermMission': //查詢短期目標清單
        $returnData = $MissionModel->updShortTermMission($_POST["data"]);
        break;
      case 'getShortTermMissionByID': //查詢單筆短期目標資料
        $returnData = $MissionModel->getShortTermMissionByID($_POST["data"]);
        break;
      case 'delShortTermMissionByID': //刪除單筆短期目標資料
        $returnData = $MissionModel->delShortTermMissionByID($_POST["data"]);
        break;
    }
    echo json_encode($returnData, true);
  }
}
