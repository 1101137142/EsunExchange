<?php

class Controller {

    private $Event = null;

    function __construct($Event) {
        $this->Event = $Event;
        
        /*$HomeModel=new HomeModel();
        $HomeModel->reflashMissionStatus();*/
        
    }
    
    function doAction() {
        require_once 'Controller/actionPerformed.php';
        $get = $this->Event->getGet();
        if (empty($get['action'])) {
            $action = 'Showpage';
        } else {
            $action = $get['action'];
        }
        $ACTION = "Controller/Action/";
        require_once $ACTION . $action . '.php';

        $actionListener = NULL;
        $actionListener = new $action($this->Event);

        return $actionListener->actionPerformed($this->Event);
    }

}
