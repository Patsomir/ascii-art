<?php
    class Database {
        private $connection;

        public function __construct($host, $dbname, $username, $password) {
            $this->connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        }

        public function getQuery($sql) {
            return $this->connection->prepare($sql);
        }
    }

    $database = new Database(
        $_SERVER["DATABASE_HOST"],
        $_SERVER["DATABASE_NAME"],
        $_SERVER["DATABASE_USERNAME"],
        $_SERVER["DATABASE_PASSWORD"]
    );
?>