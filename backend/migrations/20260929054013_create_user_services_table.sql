-- +goose Up
CREATE TABLE user_services
(
    id                   CHAR(36) PRIMARY KEY,
    user_id              CHAR(36)     NOT NULL,
    service_id           CHAR(36)     NOT NULL,
    credentials          VARBINARY(512)        DEFAULT NULL,
    oauth_token          VARBINARY(512)        DEFAULT NULL,
    oauth_refresh_token  VARBINARY(512)        DEFAULT NULL,
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, service_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

-- +goose Down
DROP TABLE user_services;
