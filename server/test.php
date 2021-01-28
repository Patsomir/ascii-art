<?php
    include 'user_service.php';
    include 'json.php';

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['user']))
    {
        send(['errors' => ['No valid session']], 401);
        exit;
    }

    $name = $userService->getUser($_SESSION['user'])['name'];
    send([
        'result' => 'Success',
        'name' => $name
    ]);
?>