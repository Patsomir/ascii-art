START TRANSACTION;

CREATE TABLE users
(
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),

    PRIMARY KEY (id),
    UNIQUE KEY (username)
);

CREATE TABLE arts
(
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NUll,
    type ENUM('image', 'animation') NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    user_id int NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE likes
(
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    art_id int NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (art_id) REFERENCES arts(id),
    UNIQUE KEY (user_id, art_id)
);

COMMIT;