<?php
    include 'user_service.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $requestData = json_decode(file_get_contents('php://input'));
        $responseData = array();

        $result = $userService->register($requestData->name, $requestData->username, $requestData->password);
        if($result === 'Success') {
            $responseData['result'] = 'Successful registration';
            http_response_code(200);
        } else {
            $responseData['errors'] = $result;
            http_response_code(400);
        }

        header('Content-Type: application/json;charset=utf-8');
        echo json_encode($responseData);
    }
?>