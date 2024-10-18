# Probiotic Quality Tracker

This project is a system for tracking and managing probiotic quality test results. It supports data ingestion from CSV files and scanned PDF documents, uses OCR/AI for data extraction from PDFs, and provides an admin interface for data review and management.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: 
   - Create a PostgreSQL database
   - Run the schema creation script: `psql -d your_database_name -f src/database/schema.sql`
4. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add necessary variables (database connection, JWT secret, etc.)
5. Start the development server: `npm run dev`

For more detailed information, please refer to the documentation in the `docs` directory.

## License

This project is licensed under the MIT License.