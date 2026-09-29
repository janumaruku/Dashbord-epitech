-- +goose Up
CREATE TABLE services
(
    id             CHAR(36)    PRIMARY KEY,
    name           VARCHAR(50) NOT NULL UNIQUE,
    description    VARCHAR(255) NOT NULL,
    requires_auth  BOOLEAN     NOT NULL DEFAULT FALSE,
    oauth_provider VARCHAR(255)         DEFAULT NULL,
    created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE services;
