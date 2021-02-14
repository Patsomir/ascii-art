<?php
    include 'like_service.php';
    include 'user_service.php';
    include 'json.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $requestData = recv();
        $responseData = array();
        $status = 200;

        session_start();
        session_regenerate_id();
        if(!isset($_SESSION['user']))
        {
            $responseData['errors'] = ['No valid session'];
            $status = 401;
        }
        else {
            $userID = $userService->getUser($_SESSION['user'])['id'];

            switch($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    $result = $likeService->like(intval($userID), intval($requestData->art_id));
                    break;
                case 'DELETE':
                    $result = $likeService->unlike(intval($userID), intval($requestData->art_id));
                    break;
            }
            if($result === 'Success') {
                $responseData['result'] = 'Successful liking';
            } else {
                $responseData['errors'] = $result;
                $status = 400;
            }
        }

        send($responseData, $status);
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $responseData = array();
        $status = 200;
        $userID = -1;

        session_start();
        session_regenerate_id();
        if(isset($_SESSION['user']))
        {
            $userID = $userService->getUser($_SESSION['user'])['id'];
        }

        if(isset($_GET['art_id'])) {
            $result = $likeService->getLikesInfo($userID, $_GET['art_id']);
            
            if(isset($result['errors'])) {
                $responseData['errors'] = $result;
                $status = 400;
            } else {
                $responseData['result'] = $result;
            }
        }
        else {
            $responseData['errors'] = ["Invalid query parameters"];
            $status = 400;
        }

        send($responseData, $status);
    }
?>