<?php

class Event {

    private $get = null;
    private $post = null;

    function __construct($get, $post) {
        $this->get = $get;
        $this->post = $post;
    }

    public function getGet() {
        return $this->get;
    }
    public function getPost() {
        return $this->post;
    }
}
