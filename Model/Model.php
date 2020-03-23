<?php

abstract class Model {

    protected $cont = null;

    public function __construct() {
        $this->init();
    }

    public function init() {
        $db_host = '192.168.50';
        $db_user = '';
        $db_name = '';
        $db_password='';
        $dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8";
        try {
            $this->cont = new PDO($dsn, $db_user, $db_password);
            
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

}

?>
