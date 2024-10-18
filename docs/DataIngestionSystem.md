# Data Ingestion System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [File Structure](#file-structure)
3. [Backend Components](#backend-components)
   - [File Upload](#file-upload)
   - [Data Extraction](#data-extraction)
   - [Data Validation and Transformation](#data-validation-and-transformation)
   - [Database Integration](#database-integration)
   - [Authentication](#authentication)
4. [Admin Interface](#admin-interface)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Development and Deployment](#development-and-deployment)

## System Overview

The Probiotic Quality Tracker is a system designed to ingest, process, and manage quality test results for probiotic products. It supports data input from CSV files and scanned PDF documents, uses OCR/AI for data extraction from PDFs, and provides an admin interface for data review and management.

Key features:
- CSV and PDF file upload
- OCR/AI-powered data extraction from PDFs
- Data validation and transformation
- Secure database storage
- Admin interface for data review and approval
- QR code generation for easy access to quality reports

## File Structure

[Insert the updated file hierarchy here]

## Backend Components

### File Upload

Located in `src/server/routes/adminRoutes.js`

- Uses `multer` for handling file uploads
- Supports CSV and PDF file types
- Stores uploaded files in the `/uploads` directory

Example usage:
```javascript
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), async (req, res) => {
  // File upload logic here
});
```

### Data Extraction

Located in `src/server/services/dataExtraction.js`

- Extracts data from CSV files using `csv-parse`
- Uses Tesseract.js for OCR on PDF files
- Implements custom parsing logic for extracted text

Key functions:
- `extractFromCSV(filePath)`
- `extractFromPDF(filePath)`
- `parseExtractedText(text)`

### Data Validation and Transformation

Located in `src/server/services/dataValidation.js` and `src/server/services/dataTransformation.js`

- Validates extracted data against predefined rules
- Transforms data into a format suitable for database insertion

Key functions:
- `validateData(data)`
- `transformData(data)`

### Database Integration

Located in `src/server/database.js`

- Uses `pg` (node-postgres) for database operations
- Implements functions for inserting and retrieving test results

Key function:
```javascript
async function insertTestResults(data) {
  // Database insertion logic
}
```

### Authentication

Located in `src/server/auth.js` and `src/server/middleware/authMiddleware.js`

- Uses JSON Web Tokens (JWT) for authentication
- Implements middleware for protecting routes

Key functions:
- `generateToken(user)`
- `authenticateToken(req, res, next)`

## Admin Interface

Located in the `src/client` directory

- React-based web application
- Components for file upload, data review, and approval
- Interacts with backend API for data management

Key components:
- `FileUpload.js`
- `DataReview.js`
- `QRScanner.js`
- `ChartRenderer.js`

## API Endpoints

- `POST /upload`: File upload endpoint
- `POST /extract`: Data extraction endpoint
- `POST /validate`: Data validation endpoint
- `POST /insert`: Database insertion endpoint
- `GET /quality-report/:manufacturer/:product/:lot`: Retrieve quality report

For detailed API documentation, refer to `docs/API.md`.

## Database Schema

Located in `src/database/schema.sql`

Key tables:
- `manufacturers`
- `products`
- `lots`
- `purity_results`
- `potency_results`
- `activity_results`

For detailed schema information, refer to `docs/DatabaseSchema.md`.

## Development and Deployment

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database:
   - Create a PostgreSQL database
   - Run the schema creation script: `psql -d your_database_name -f src/database/schema.sql`

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add necessary variables (database connection, JWT secret, etc.)

4. Start the development server:
   ```
   npm run dev
   ```

5. Build the client:
   ```
   cd src/client && npm run build
   ```

6. For production deployment:
   - Set up a production database
   - Configure a web server (e.g., Nginx) to serve the static files and proxy API requests
   - Use a process manager like PM2 to run the Node.js application

For more detailed instructions, refer to the `README.md` file in the project root.