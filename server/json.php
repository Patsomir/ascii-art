<?php
    function recv() {
        return json_decode(file_get_contents('php://input'));
    }

    function send($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json;charset=utf-8');
        echo json_encode($data);
    }
?>