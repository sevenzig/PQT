-- src/database/schema.sql
-- version 1.01

-- Manufacturers table
CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20)
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id),
    name VARCHAR(100) NOT NULL,
    upc VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    UNIQUE (manufacturer_id, name)
);

-- Lots table
CREATE TABLE lots (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    lot_number VARCHAR(20) NOT NULL,
    production_date DATE NOT NULL,
    expiration_date DATE,
    UNIQUE (product_id, lot_number)
);

-- Purity results table
CREATE TABLE purity_results (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER NOT NULL REFERENCES lots(id),
    test_date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    specification VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    pass_fail VARCHAR(10) NOT NULL
);

-- Potency results table
CREATE TABLE potency_results (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER NOT NULL REFERENCES lots(id),
    test_date DATE NOT NULL,
    strain VARCHAR(255) NOT NULL,
    specification NUMERIC NOT NULL,
    result NUMERIC NOT NULL
);

-- Activity results table
CREATE TABLE activity_results (
    id SERIAL PRIMARY KEY,
    lot_id INTEGER NOT NULL REFERENCES lots(id),
    test_date DATE NOT NULL,
    time_point VARCHAR(10) NOT NULL,
    ph NUMERIC NOT NULL,
    lactic_acid_percentage NUMERIC NOT NULL
);

-- Indexes for improved query performance
CREATE INDEX idx_products_manufacturer_id ON products(manufacturer_id);
CREATE INDEX idx_lots_product_id ON lots(product_id);
CREATE INDEX idx_purity_results_lot_id ON purity_results(lot_id);
CREATE INDEX idx_potency_results_lot_id ON potency_results(lot_id);
CREATE INDEX idx_activity_results_lot_id ON activity_results(lot_id);