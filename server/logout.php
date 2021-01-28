<?php
    include 'json.php';

    session_start();
    unset($_SESSION['user']);
    session_destroy();

    send(['result' => 'Successfully logged out']);
?>