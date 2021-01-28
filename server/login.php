<?php
    include 'auth_service.php';
    include 'user_service.php';
    include 'json.php';

    session_start();

    if($_SERVER['REQUEST_METHOD'] !== 'POST') {
        exit;
    }

    if( isset($_REQUEST['username']) && isset($_REQUEST['password']) )
    {
        if( $authService->auth($_REQUEST['username'], $_REQUEST['password']) )
        {
            $_SESSION['user'] = $_REQUEST['username'];
            $user = $userService->getUser($_REQUEST['username']);
            send([
                'result' => 'Success',
                'name' => $user['name']
            ]);
            exit;
        } 
    }
    send(['errors' => ['Invalid username or password']], 401);
?>