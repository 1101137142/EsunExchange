<?php

class HomeModel extends Model {

    function reflashMissionStatus() {
        //找出所有狀態為 未完成 或 完成 的任務 
        $sql = "SELECT * FROM `mss_mission` WHERE `MissionStatus` = '0' or `MissionStatus` = '1'";
        $stmt = $this->cont->prepare($sql);
        $status[] = $stmt->execute();
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $refresh = false;
            $RefreshTime = strtotime($row['MissionRefreshTime']);
            if (strtotime("now") >= strtotime($row['MissionEndTime']) && $row['MissionEndTime'] != '' && $row['MissionAttribute'] != '3') {
                $sql_update = "update `mss_mission` set MissionStatus=2 where `MissionID`=?";
                $stmt_update = $this->cont->prepare($sql_update);
                $status[] = $stmt_update->execute(array($row['MissionID']));
            }
            if ($row['MissionAttribute'] == '1' && ($row['MissionStatus'] == '0' || $row['MissionStatus'] == '1')) {
                if (strtotime("now") >= $RefreshTime) {
                    $RefreshQuantity = 0;
                    switch ($row['MissionPeriodList']) {
                        case '1':
                            while (strtotime("now") >= $RefreshTime + (60 * 60 * $row['MissionPeriod'])) {
                                $RefreshTime = $RefreshTime + (60 * 60 * $row['MissionPeriod']);
                                $RefreshQuantity = $RefreshQuantity + 1;
                                $refresh = true;
                            };
                            break;
                        case '2':
                            while (strtotime("now") >= $RefreshTime + (60 * 60 * 24 * $row['MissionPeriod'])) {
                                $RefreshTime = $RefreshTime + (60 * 60 * 24 * $row['MissionPeriod']);
                                $RefreshQuantity = $RefreshQuantity + 1;
                                $refresh = true;
                            };
                            break;
                        case '3':
                            while (strtotime("now") >= $RefreshTime + (60 * 60 * 24 * 7 * $row['MissionPeriod'])) {
                                $RefreshTime = $RefreshTime + (60 * 60 * 24 * 7 * $row['MissionPeriod']);
                                $RefreshQuantity = $RefreshQuantity + 1;
                                $refresh = true;
                            };
                            break;
                        case '4':
                            while (strtotime("now") >= mktime(date("G", $RefreshTime), date("i", $RefreshTime), date("s", $RefreshTime), date("m", $RefreshTime) + $row['MissionPeriod'], date("d", $RefreshTime), date("Y", $RefreshTime))) {
                                $RefreshTime = mktime(date("G", $RefreshTime), date("i", $RefreshTime), date("s", $RefreshTime), date("m", $RefreshTime) + $row['MissionPeriod'], date("d", $RefreshTime), date("Y", $RefreshTime));
                                $RefreshQuantity = $RefreshQuantity + 1;
                                $refresh = true;
                            };
                            break;
                        case '5':
                            while (strtotime("now") >= mktime(date("G", $RefreshTime), date("i", $RefreshTime), date("s", $RefreshTime), date("m", $RefreshTime), date("d", $RefreshTime), date("Y", $RefreshTime) + $row['MissionPeriod'])) {
                                $RefreshTime = mktime(date("G", $RefreshTime), date("i", $RefreshTime), date("s", $RefreshTime), date("m", $RefreshTime), date("d", $RefreshTime), date("Y", $RefreshTime) + $row['MissionPeriod']);
                                $RefreshQuantity = $RefreshQuantity + 1;
                                $refresh = true;
                            };
                            break;
                        default:
                            break;
                    }
                    if ($refresh == true) {
                        $RefreshTime = date("Y-m-d H:i:s", $RefreshTime);
                        $sql_update = "update `mss_mission` set `MissionStatus`=0 ,`MissionRefreshTime`='" . $RefreshTime . "',`MissionRefreshQuantity`=MissionRefreshQuantity+$RefreshQuantity where `MissionID`=?";
                        $stmt_update = $this->cont->prepare($sql_update);
                        $status[] = $stmt_update->execute(array($row['MissionID']));
                    }
                }
            }
        }
        $sql_update="UPDATE `mss_shopstore` SET `CommodityStatus`=1 WHERE NOW() > `CommodityStartTime` AND `CommodityStatus` =0 ";
        $stmt_update = $this->cont->prepare($sql_update);
        $status[] = $stmt_update->execute();
        $sql_update="UPDATE `mss_shopstore` SET `CommodityStatus`=3 WHERE (NOW() > `CommodityDeadline` AND `CommodityDeadline` IS NOT NULL) AND `CommodityStatus` =1 ";
        $stmt_update = $this->cont->prepare($sql_update);
        $status[] = $stmt_update->execute();
    }

    function getPoint() {
        $sql_search = "SELECT * FROM `mss_point`";
        $stmt_search = $this->cont->prepare($sql_search);
        $status[] = $stmt_search->execute();
        return $stmt_search;
    }

}
