<?php
    include_once 'database.php';
    include_once 'validation.php';

    class ArtService {
        private $database;

        public function __construct($database) {
            $this->database = $database;
        }

        public function addArt($name, $content, $type, $user_id) {
            $errors = array();

            if(!pushIfError($errors, validateString($name, 'Name'))) {
                pushIfError($errors, validateMinLength($name, 1, 'Name'));
                pushIfError($errors, validateMaxLength($name, 255, 'Name'));
            }
            if($type != "image" && $type != "animation") {
                pushIfError($errors, "Invalid type of art");
            }

            if(count($errors) > 0) {
                return $errors;
            }

            $query = $this->database->getQuery(
                'INSERT INTO arts(name, content, type, user_id)
                VALUES (?, ?, ?, ?);'
            );

            if($query->execute([$name, $content, $type, $user_id])){
                return 'Success';
            } else {
                return ["Invalid request"];
            }
        }

        public function getArt($id) {
            $query = $this->database->getQuery(
                'SELECT arts.id, arts.name, arts.content, arts.type,
                arts.created_at, arts.last_modified, users.name as creator,
                users.username as username
                FROM arts
                LEFT JOIN users ON arts.user_id=users.id
                WHERE arts.id = ?;'
            );

            $query->execute([$id]);
            $result = $query->fetch(PDO::FETCH_ASSOC);

            if ($result !== false) {
                $result['result'] = $result;
            }
            else {
                $result['errors'] = ["Query error"];
            }
            return $result;
        }

        public function getArtPage($page, $pageSize) {
            $result = array();
            $errors = array();

            if(!pushIfError($errors, validateInteger($page, 'Page'))) {
                pushIfError($errors, validateNonNegative($page, 'Page'));
            }
            if(!pushIfError($errors, validateInteger($pageSize, 'Page size'))) {
                pushIfError($errors, validatePositive($pageSize, 'Page size'));
            }

            if(count($errors) > 0) {
                $result['errors'] = $errors;
                return $result;
            }

            $offset = $page * $pageSize;

            $query = $this->database->getQuery(
                "SELECT arts.id, arts.name, users.username 
                FROM arts
                LEFT JOIN users ON arts.user_id=users.id
                ORDER BY arts.last_modified DESC
                LIMIT :limit OFFSET :offset;"
            );

            $query->bindValue(':limit', (int) $pageSize, PDO::PARAM_INT);
            $query->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
            $query->execute();
            $arts = $query->fetchAll(PDO::FETCH_ASSOC);

            if ($arts !== false) {
                $result['result'] = $arts;
            }
            else {
                $result['errors'] = ["Query error"];
            }
            
            return $result;
        }
    }

    $artService = new ArtService($database);
?>