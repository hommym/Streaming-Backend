CREATE TABLE user(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(50) NOT NULL,
    email   VARCHAR(20) NOT NULL,
    type    ENUM('admin','norm') NOT NULL
);