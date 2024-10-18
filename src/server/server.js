// src/server/server.js
// version 1.02

// Import required modules
const express = require('express');
const multer = require('multer'); // Middleware for handling file uploads
const path = require('path');
const { extractFromCSV, extractFromPDF } = require('./services/dataExtraction'); // Functions for extracting data from CSV and PDF files
const { validateData } = require('./services/dataValidation'); // Function for validating extracted data
const { transformData } = require('./services/dataTransformation'); // Function for transforming validated data
const { insertTestResults } = require('./database'); // Function for inserting test results into the database
const { authenticateToken } = require('./middleware/authMiddleware'); // Middleware for authenticating user tokens

// Create an Express app instance
const app = express();
// Configure Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Parse incoming JSON data and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Define routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/quality-reports', require('./routes/qualityReportRoutes'));
app.use('/api/admin', authenticateToken, require('./routes/adminRoutes')); // Authenticate token for admin routes

// Route for file upload
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    let extractedData;

    // Check the file extension and extract data accordingly
    if (path.extname(file.originalname).toLowerCase() === '.csv') {
      extractedData = await extractFromCSV(file.path);
    } else if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      extractedData = await extractFromPDF(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Validate and transform the extracted data
    const validatedData = validateData(extractedData);
    const transformedData = transformData(validatedData);

    res.json({ data: transformedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during file processing' });
  }
});

// Route for inserting test results into the database
app.post('/api/insert', authenticateToken, async (req, res) => {
  try {
    await insertTestResults(req.body.data);
    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during data insertion' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
