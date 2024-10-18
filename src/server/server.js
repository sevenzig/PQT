// src/server/server.js
// version 1.02

const express = require('express');
const multer = require('multer');
const path = require('path');
const { extractFromCSV, extractFromPDF } = require('./services/dataExtraction');
const { validateData } = require('./services/dataValidation');
const { transformData } = require('./services/dataTransformation');
const { insertTestResults } = require('./database');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/quality-reports', require('./routes/qualityReportRoutes'));
app.use('/api/admin', authenticateToken, require('./routes/adminRoutes'));

app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    let extractedData;

    if (path.extname(file.originalname).toLowerCase() === '.csv') {
      extractedData = await extractFromCSV(file.path);
    } else if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      extractedData = await extractFromPDF(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const validatedData = validateData(extractedData);
    const transformedData = transformData(validatedData);

    res.json({ data: transformedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during file processing' });
  }
});

app.post('/api/insert', authenticateToken, async (req, res) => {
  try {
    await insertTestResults(req.body.data);
    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during data insertion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));