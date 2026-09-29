-- +goose Up
CREATE TABLE widget_params
(
    id          CHAR(36)     PRIMARY KEY,
    widget_id   CHAR(36)     NOT NULL,
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(50)  NOT NULL,
    description TEXT         NOT NULL,
    UNIQUE (widget_id, name),
    FOREIGN KEY (widget_id) REFERENCES widgets (id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE widget_params;
