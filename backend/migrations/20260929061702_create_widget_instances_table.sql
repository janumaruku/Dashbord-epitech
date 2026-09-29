-- +goose Up
CREATE TABLE widget_instances
(
    id           CHAR(36)  PRIMARY KEY,
    user_id      CHAR(36)  NOT NULL,
    widget_id    CHAR(36)  NOT NULL,
    config       JSON      NOT NULL,
    refresh_rate INTEGER   NOT NULL,
    position     JSON      NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (refresh_rate BETWEEN 5 AND 3600),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (widget_id) REFERENCES widgets (id) ON DELETE RESTRICT
);

-- +goose Down
DROP TABLE widget_instances;
