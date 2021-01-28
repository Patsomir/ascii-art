<?php
    include 'json.php';

    if($_SERVER['REQUEST_METHOD'] !== 'POST') {
        exit;
    }

    session_start();
    unset($_SESSION['user']);
    session_destroy();

    send(['result' => 'Successfully logged out']);
?>