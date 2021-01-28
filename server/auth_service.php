<?php
    include_once 'database.php';

    class AuthService {
        private $database;

        public function __construct($database) {
            $this->database = $database;
        }

        public function auth($username, $password) {
            $query = $this->database->getQuery(
                'SELECT *
                FROM users
                WHERE username = ?;'
            );
            $query->execute([$username]);
            $user = $query->fetch(PDO::FETCH_ASSOC);
            if($user && password_verify($password , $user['hashed_password'])) {
                return true;
            }
            return false;
        }
    }

    $authService = new AuthService($database);
?>