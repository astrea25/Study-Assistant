var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var multer = require("multer");
var pdfParse = require("pdf-parse");
var serverless = require("serverless-http");

var indexRouter = require("../routes/index");

var app = express();

// ✅ Use Morgan for logging
app.use(logger("dev"));

// ✅ Middleware for parsing JSON & cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ CORS setup
const whitelist = ["*"];
app.use((req, res, next) => {
  const origin = req.get("referer");
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

// ✅ Context middleware
const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

// ✅ Serve static files if needed
app.use(express.static(path.join(__dirname, "public")));

// ✅ Define Routes
app.use("/", indexRouter);

// ✅ PDF Text Extraction Endpoint
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/extract-text", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

// ✅ Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// ✅ Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// ✅ Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
