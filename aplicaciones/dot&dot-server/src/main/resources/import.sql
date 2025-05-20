INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

INSERT INTO users (username, password, email) VALUES ('admin', '$2a$10$ct32Oj3tMPd2id.W9QPxt.T4FX7L9C6pNKImaasanJnCMW8Gcv.sG', 'admin@gmail.com');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);