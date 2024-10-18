// src/server/routes/adminRoutes.js
// version 1.01

const express = require('express');
const multer = require('multer');
const { extractFromCSV } = require('../services/dataExtraction');
const { validatePurityData, validatePotencyData, validateActivityData } = require('../services/dataValidation');
const { transformPurityData, transformPotencyData, transformActivityData } = require('../services/dataTransformation');
const { insertPurityResults, insertPotencyResults, insertActivityResults } = require('../database');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function processUpload(validator, transformer, inserter) {
  return async (req, res) => {
    try {
      const { lotId } = req.body;
      if (!lotId) {
        return res.status(400).json({ error: 'Lot ID is required' });
      }

      const extractedData = await extractFromCSV(req.file.path);
      const validatedData = validator(extractedData);

      const invalidData = validatedData.filter(item => item.validationErrors);
      if (invalidData.length > 0) {
        return res.status(400).json({ error: 'Invalid data in CSV', invalidRows: invalidData });
      }

      const transformedData = transformer(validatedData, lotId);
      await inserter(transformedData);

      res.json({ message: 'Data uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during file processing' });
    }
  };
}

router.post('/upload-purity', upload.single('file'), processUpload(validatePurityData, transformPurityData, insertPurityResults));
router.post('/upload-potency', upload.single('file'), processUpload(validatePotencyData, transformPotencyData, insertPotencyResults));
router.post('/upload-activity', upload.single('file'), processUpload(validateActivityData, transformActivityData, insertActivityResults));

module.exports = router;