<?php
    include 'art_service.php';
    include 'user_service.php';
    include 'json.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
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

            $result = $artService->addArt($requestData->name, $requestData->content, $requestData->type, $userID);
            if($result === 'Success') {
                $responseData['result'] = 'Successful uploading';
            } else {
                $responseData['errors'] = $result;
                $status = 400;
            }
        }

        send($responseData, $status);
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $requestData = recv();
        $responseData = array();
        $status = 200;

        if(isset($_GET['id'])) {
            $result = $artService->getArt($_GET['id']);
            fillFromResult($responseData, $status, $result);
        }
        else if(isset($_GET['page']) && isset($_GET['pageSize'])) {
            $result = $artService->getArtPage(intval($_GET['page']), intval($_GET['pageSize']));
            fillFromResult($responseData, $status, $result);
        }
        else {
            $responseData['errors'] = ["Invalid query parameters"];
            $status = 400;
        }

        send($responseData, $status);
    }

    function fillFromResult(&$responseData, &$status, $result) {
        if(isset($result['errors'])) {
            $responseData['errors'] = ['No art found'];
            $status = 400;
        } else {
            $responseData['result'] = $result['result'];
        }
    }
?>