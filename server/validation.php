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

    function validateString($str, $displayName = 'Value') {
        if(!is_string($str)) {
            return "$displayName must be a string";
        }
    }

    function validateInteger($num, $displayName = 'Value') {
        if(!is_int($num)) {
            return "$displayName must be an integer";
        }
    }

    function validateNonNegative($num, $displayName = 'Value') {
        if($num < 0) {
            return "$displayName must be non negative";
        }
    }

    function validatePositive($num, $displayName = 'Value') {
        if($num <= 0) {
            return "$displayName must be positive";
        }
    }

    function pushIfError(&$arr, $value) {
        if(!is_null($value)) {
            array_push($arr, $value);
            return true;
        }
        return false;
    }
?>