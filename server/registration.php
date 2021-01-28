<?php
    include 'user_service.php';
    include 'json.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $requestData = recv();
        $responseData = array();
        $status = 200;

        $result = $userService->register($requestData->name, $requestData->username, $requestData->password);
        if($result === 'Success') {
            $responseData['result'] = 'Successful registration';
        } else {
            $responseData['errors'] = $result;
            $status = 400;
        }

        send($responseData, $status);
    }
?>