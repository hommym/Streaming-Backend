CREATE TABLE user(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name    VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE    ,
    passwd       MEDIUMTEXT  NOT NULL,
    user_type    ENUM('admin','norm') NOT NULL
);


CREATE TABLE movie_info(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(100) NOT NULL,
    duration    VARCHAR(4) NOT NULL, 
    genre       VARCHAR(20) NOT NULL,
    ratings     INT    DEFAULT 0,
    descrip     MEDIUMTEXT ,
    poster_url  VARCHAR(255),
    movie_url   VARCHAR(255) NOT NULL,
    src         ENUM('system') DEFAULT 'system'
);

CREATE TABLE playlist(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(100) NOT NULL,
    owner_id    BIGINT NOT NULL,
    src         ENUM('system','user') DEFAULT 'system',
    created_at  DATE NOT NULL,

    CONSTRAINT fk_playlist_user FOREIGN KEY(owner_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE playlist_item(
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    play_list_id        BIGINT NOT NUll,
    movie_id            BIGINT NOT NULL,
    order_no            INT    NOT NULL,
    info_src            ENUM('system','tmdb'),
    movie_title         VARCHAR(255) NOT NULL,
    poster_url          VARCHAR(255) NOT NULL,
    created_at          DATE NOT NULL,
    
    CONSTRAINT fk_playlistItem_playList FOREIGN KEY (play_list_id) REFERENCES playlist(id) ON DELETE CASCADE
);


CREATE TABLE live_stream (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    playlist_id   BIGINT NOT NULL,
    stream_link   VARCHAR(255) NOT NULL,
    live_type     ENUM('main', 'theatre') NOT NULL,

    CONSTRAINT fk_liveStream_playlist FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE
);

CREATE TABLE live_viewer (
    connection_id BIGINT NOT NUll,
    user_id       BIGINT PRIMARY KEY,
    live_id       BIGINT NOT NULL,

    CONSTRAINT fk_liveViewer_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_liveViewer_liveStream FOREIGN KEY (live_id) REFERENCES live_stream(id) ON DELETE CASCADE
);

CREATE TABLE live_message (
    live_id   BIGINT NOT NULL,
    user_id   BIGINT NOT NULL,
    content   MEDIUMTEXT NOT NULL,

    PRIMARY KEY(user_id,live_id),
    CONSTRAINT fk_liveMessage_liveStream FOREIGN KEY (live_id) REFERENCES live_stream(id) ON DELETE CASCADE,
    CONSTRAINT fk_liveMessage_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);