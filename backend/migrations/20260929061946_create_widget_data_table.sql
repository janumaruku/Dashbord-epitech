-- +goose Up
CREATE TABLE widget_data
(
    id                  CHAR(36)  PRIMARY KEY,
    widget_instance_id  CHAR(36)  NOT NULL,
    data                JSON               DEFAULT NULL,
    fetched_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at          TIMESTAMP          DEFAULT NULL,
    FOREIGN KEY (widget_instance_id) REFERENCES widget_instances (id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE widget_data;
