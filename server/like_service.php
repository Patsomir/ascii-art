<?php
    include_once 'database.php';
    include_once 'validation.php';

    class LikeService {
        private $database;

        public function __construct($database) {
            $this->database = $database;
        }

        public function like($user_id, $art_id) {
            $errors = array();

            pushIfError($errors, validateInteger($user_id, 'User ID'));
            pushIfError($errors, validateInteger($art_id, 'Art ID'));

            if(count($errors) > 0) {
                return $errors;
            }

            $query = $this->database->getQuery(
                'INSERT INTO likes(user_id, art_id)
                VALUES (?, ?);'
            );

            if($query->execute([$user_id, $art_id])){
                return 'Success';
            } else {
                if($query->errorInfo()[1] === 1062) {
                    array_push($errors, 'Already liked');
                } else {
                    array_push($errors, 'Invalid request');
                }
                return $errors;
            }
        }

        public function unlike($user_id, $art_id) {
            $errors = array();

            pushIfError($errors, validateInteger($user_id, 'User ID'));
            pushIfError($errors, validateInteger($art_id, 'Art ID'));

            if(count($errors) > 0) {
                return $errors;
            }

            $query = $this->database->getQuery(
                'DELETE
                FROM likes
                WHERE user_id = ? AND art_id = ?;'
            );

            if($query->execute([$user_id, $art_id])){
                return 'Success';
            } else {
                array_push($errors, 'Invalid request');
                return $errors;
            }
        }

        public function getLikesInfo($user_id, $art_id) {
            $likesQuery = $this->database->getQuery(
                'SELECT COUNT(*)
                FROM likes
                WHERE art_id = ?;'
            );

            $userLikedQuery = $this->database->getQuery(
                'SELECT COUNT(*)
                FROM likes
                WHERE art_id = ? AND user_id = ?;'
            );

            $likesQuery->execute([$art_id]);
            $userLikedQuery->execute([$art_id, $user_id]);

            $likes = $likesQuery->fetch();
            $userLiked = $userLikedQuery->fetch();

            $info = array();

            if ($likes !== false && $userLiked !== false) {
                $info['likes'] = $likes[0];
                $info['user_liked'] = $userLiked[0] == 1;
            }
            else {
                return ["Query error"];
            }
            return $info;
        }
    }

    $likeService = new LikeService($database);
?>