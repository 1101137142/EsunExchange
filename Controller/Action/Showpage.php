<?php

class ShowPage implements actionPerformed {

    public function actionPerformed($Event) {
        //載入html主框架
        require_once 'View/MainFrame.php';

        $get = $Event->getGet();
        //判斷並連接內容頁
        if (empty($get["Content"])) {
            $Content = "Content";
        } else {
            $Content = $get["Content"];
        }
        $ACTION = "Controller/Action/Show/";
        require_once $ACTION . $Content . '.php';
        $ContentListener = NULL;
        $ContentListener = new $Content();
        $showContent = $ContentListener->actionPerformed($Event);
        
        require_once 'View/MainFrameFooter.php';
        
        
        /* $smarty = new KSmarty();
          $smarty->assign("showContent", $showContent);
          $smarty->display("NavBar.tpl"); */
    }

}

?>