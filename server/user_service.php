<?php
    include_once 'database.php';
    include_once 'validation.php';

    class UserService {
        private $database;

        public function __construct($database) {
            $this->database = $database;
        }

        public function register($name, $username, $password) {
            $errors = array();

            if(!pushIfError($errors, validateString($name, 'Name'))) {
                pushIfError($errors, validateMinLength($name, 1, 'Name'));
            }
            if(!pushIfError($errors, validateString($username, 'Username'))) {
                pushIfError($errors, validateMinLength($username, 6, 'Username'));
            }
            if(!pushIfError($errors, validateString($password, 'Password'))) {
                pushIfError($errors, validateMinLength($password, 6, 'Password'));
            }

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

        public function getUser($username) {
            $query = $this->database->getQuery(
                'SELECT *
                FROM users
                WHERE username = ?;'
            );
            $query->execute([$username]);
            return $query->fetch(PDO::FETCH_ASSOC);
        }
    }

    $userService = new UserService($database);
?>