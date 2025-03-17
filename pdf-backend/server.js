const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow frontend to call API
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/extract-text", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ error: "No file uploaded" });
    const data = await pdfParse(req.file.buffer);

    res.json({ text: data.text });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).send({ error: "Failed to extract text" });
  }
});

// Export app (for Vercel)
module.exports = app;
