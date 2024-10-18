# Probiotic Quality Tracker Database Schema

## Overview

This document describes the database schema for the Probiotic Quality Tracker system. The database is designed to store information about manufacturers, products, lots, and various quality test results including purity, potency, and activity tests.

## Tables

### 1. manufacturers

Stores information about probiotic manufacturers.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the manufacturer |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Name of the manufacturer |
| contact_email | VARCHAR(100) | | Email contact for the manufacturer |
| contact_phone | VARCHAR(20) | | Phone contact for the manufacturer |

### 2. products

Stores information about probiotic products.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the product |
| manufacturer_id | INTEGER | NOT NULL, FOREIGN KEY | References manufacturers(id) |
| name | VARCHAR(100) | NOT NULL | Name of the product |
| upc | VARCHAR(20) | NOT NULL, UNIQUE | Universal Product Code |
| description | TEXT | | Product description |

Indexes:
- CREATE INDEX idx_products_manufacturer_id ON products(manufacturer_id);

### 3. lots

Represents specific production batches of products.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the lot |
| product_id | INTEGER | NOT NULL, FOREIGN KEY | References products(id) |
| lot_number | VARCHAR(20) | NOT NULL | Lot number |
| production_date | DATE | NOT NULL | Date of production |
| expiration_date | DATE | | Expiration date |

Indexes:
- CREATE INDEX idx_lots_product_id ON lots(product_id);
- CREATE UNIQUE INDEX idx_lots_product_lot ON lots(product_id, lot_number);

### 4. purity_results

Stores purity test results for each lot.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the purity result |
| lot_id | INTEGER | NOT NULL, FOREIGN KEY | References lots(id) |
| test_date | DATE | NOT NULL | Date of the purity test |
| description | VARCHAR(255) | NOT NULL | Description of the test |
| specification | VARCHAR(255) | NOT NULL | Test specification |
| result | VARCHAR(255) | NOT NULL | Test result |
| method | VARCHAR(255) | NOT NULL | Test method used |
| pass_fail | VARCHAR(10) | NOT NULL | Pass or Fail status |
| evaluation | VARCHAR(255) | | Additional evaluation notes |

Indexes:
- CREATE INDEX idx_purity_results_lot_id ON purity_results(lot_id);

### 5. potency_results

Stores potency test results for each lot.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the potency result |
| lot_id | INTEGER | NOT NULL, FOREIGN KEY | References lots(id) |
| test_date | DATE | NOT NULL | Date of the potency test |
| strain | VARCHAR(255) | NOT NULL | Probiotic strain tested |
| specification | NUMERIC | NOT NULL | Expected potency value |
| result | NUMERIC | NOT NULL | Actual potency value |

Indexes:
- CREATE INDEX idx_potency_results_lot_id ON potency_results(lot_id);

### 6. activity_results

Stores activity test results for each lot.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the activity result |
| lot_id | INTEGER | NOT NULL, FOREIGN KEY | References lots(id) |
| test_date | DATE | NOT NULL | Date of the activity test |
| time_point | VARCHAR(10) | NOT NULL | Time point of measurement |
| ph | NUMERIC | NOT NULL | pH value |
| lactic_acid_percentage | NUMERIC | NOT NULL | Percentage of lactic acid |

Indexes:
- CREATE INDEX idx_activity_results_lot_id ON activity_results(lot_id);

## Relationships

1. A manufacturer can have multiple products (one-to-many)
2. A product can have multiple lots (one-to-many)
3. A lot can have multiple purity, potency, and activity results (one-to-many)

## Data Integrity

- Foreign key constraints ensure referential integrity between related tables.
- Unique constraints on manufacturer names, product UPCs, and lot numbers (within a product) prevent duplicate entries.
- NOT NULL constraints ensure that essential data is always provided.

## Indexing Strategy

- Foreign key columns are indexed to improve join performance.
- A composite index on product_id and lot_number in the lots table allows for fast lookups of specific lots.

## Notes for Developers

1. When inserting new test results, ensure that the corresponding lot exists in the lots table.
2. Use appropriate data types when interacting with numeric fields (e.g., NUMERIC for potency values and pH).
3. Consider using database transactions when inserting related data across multiple tables to ensure consistency.
4. Be mindful of the length limitations on VARCHAR fields, especially for names and descriptions.

## Future Considerations

1. Implement partitioning on large tables (e.g., test results) if data volume grows significantly.
2. Consider adding a users table for authentication and authorization if not handled externally.
3. Evaluate the need for archiving old data to maintain performance as the database grows.