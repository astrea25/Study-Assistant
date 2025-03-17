const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const app = express();

// Simple CORS configuration that allows all origins
app.use(cors());

app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/extract-text', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

// Export the app instead of starting the server
module.exports = app;
