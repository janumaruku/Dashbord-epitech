-- +goose Up
CREATE TABLE widgets
(
    id          CHAR(36)     PRIMARY KEY,
    service_id  CHAR(36)     NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (service_id, name),
    FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT
);

-- +goose Down
DROP TABLE widgets;
