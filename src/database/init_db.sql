-- Drop database if it exists and create new one
DROP DATABASE IF EXISTS probiotics;
CREATE DATABASE probiotics;

-- Connect to the new database
\c probiotics

-- Create tables
CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id),
    name VARCHAR(100) NOT NULL,
    upc VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    UNIQUE (manufacturer_id, name)
);

CREATE TABLE lots (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    lot_number VARCHAR(20) NOT NULL,
    production_date DATE NOT NULL,
    expiration_date DATE,
    UNIQUE (product_id, lot_number)
);

CREATE TABLE purity_results (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER NOT NULL REFERENCES lots(id),
    test_date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    specification VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    pass_fail VARCHAR(10) NOT NULL
);

CREATE TABLE potency_results (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER NOT NULL REFERENCES lots(id),
    test_date DATE NOT NULL,
    strain VARCHAR(255) NOT NULL,
    specification NUMERIC NOT NULL,
    result NUMERIC NOT NULL
);

CREATE TABLE activity_results (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER NOT NULL REFERENCES lots(id),
    test_date DATE NOT NULL,
    time_point VARCHAR(10) NOT NULL,
    ph NUMERIC NOT NULL,
    lactic_acid_percentage NUMERIC NOT NULL
);

-- Create indexes
CREATE INDEX idx_products_manufacturer_id ON products(manufacturer_id);
CREATE INDEX idx_lots_product_id ON lots(product_id);
CREATE INDEX idx_purity_results_lot_id ON purity_results(lot_id);
CREATE INDEX idx_potency_results_lot_id ON potency_results(lot_id);
CREATE INDEX idx_activity_results_lot_id ON activity_results(lot_id);

-- Insert sample data
INSERT INTO manufacturers (name, contact_email, contact_phone)
VALUES ('Master Supplements', 'contact@master-supplements.com', '555-0123');

INSERT INTO products (manufacturer_id, name, upc, description)
VALUES (1, 'Theralac', '1234567890', 'Probiotic supplement');

INSERT INTO lots (product_id, lot_number, production_date, expiration_date)
VALUES (1, '07231A', '2023-07-23', '2024-07-23');

INSERT INTO purity_results (lot_id, test_date, description, specification, result, pass_fail)
VALUES 
(1, '2023-08-01', 'E. Coli', 'Negative/10GM', 'Negative/10GM', 'Pass'),
(1, '2023-08-01', 'Salmonella', 'Negative/10GM', 'Negative/10GM', 'Pass');

INSERT INTO potency_results (lot_id, test_date, strain, specification, result)
VALUES 
(1, '2023-08-01', 'L. acidophilus', 10.0, 15.2),
(1, '2023-08-01', 'B. lactis', 10.0, 12.8);

INSERT INTO activity_results (lot_id, test_date, time_point, ph, lactic_acid_percentage)
VALUES 
(1, '2023-08-01', '0h', 6.7, 0.03),
(1, '2023-08-01', '4h', 5.5, 0.25);