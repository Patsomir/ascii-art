<?php
    function validateMinLength($str, $min, $displayName = 'Value') {
        if(mb_strlen($str) < $min) {
            return "$displayName must be at least $min characters long";
        }
    }

    function validateMaxLength($str, $max, $displayName = 'Value') {
        if(mb_strlen($str) > $max) {
            return "$displayName must be no more than $max characters long";
        }
    }

    function pushIfNotNull(&$arr, $value) {
        if(!is_null($value)) {
            array_push($arr, $value);
        }
    }
?>