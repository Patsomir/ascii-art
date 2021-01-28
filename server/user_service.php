<?php
    include 'database.php';
    include 'validation.php';

    class UserService {
        private $database;

        public function __construct($database) {
            $this->database = $database;
        }

        public function register($name, $username, $password) {
            $errors = array();
            pushIfNotNull($errors, validateMinLength($name, 1, 'Name'));
            pushIfNotNull($errors, validateMinLength($username, 6, 'Username'));
            pushIfNotNull($errors, validateMinLength($password, 6, 'Password'));

            if(count($errors) > 0) {
                return $errors;
            }

            $query = $this->database->getQuery(
                'INSERT INTO users(name, username, hashed_password)
                VALUES (?, ?, ?);'
            );

            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            if($query->execute([$name, $username, $hashed_password])) {
                return 'Success';
            } else {
                if($query->errorInfo()[1] === 1062) {
                    array_push($errors, 'Username already taken');
                }
                return $errors;
            }
        }
    }

    $userService = new UserService($database);
?>