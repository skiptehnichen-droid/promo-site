const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Храним данные в файлах
const CODES_FILE = path.join(__dirname, "codes.json");
const SETTINGS_FILE = path.join(__dirname, "settings.json");

// Чтение кодов
let codes = [];
if (fs.existsSync(CODES_FILE)) {
  codes = JSON.parse(fs.readFileSync(CODES_FILE));
}

// Чтение настроек
let settings = { backgroundColor: "#000000", accentColor: "#ff337a" };
if (fs.existsSync(SETTINGS_FILE)) {
  settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));
}

// --- Проверка промокода ---
app.get("/check", (req, res) => {
  const enteredCode = (req.query.code || "").trim();
  const codeObj = codes.find(c => c.code === enteredCode);

  if (codeObj) {
    res.json({
      text: codeObj.text,
      file: codeObj.file || "",
      image: codeObj.image || ""
    });
  } else {
    res.status(400).json({ error: "Invalid code" });
  }
});

// --- Админка ---
app.get("/admin/list", (req, res) => {
  res.json(codes);
});

app.post("/admin/add", multer().none(), (req, res) => {
  const { code, text, file } = req.body;
  codes.push({ code: code.trim(), text, file });
  fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
  res.sendStatus(200);
});

app.post("/admin/delete", (req, res) => {
  const { code } = req.body;
  codes = codes.filter(c => c.code !== code);
  fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
  res.sendStatus(200);
});

app.get("/admin/settings", (req, res) => {
  res.json(settings);
});

app.post("/admin/settings", (req, res) => {
  const { backgroundColor, accentColor } = req.body;
  settings = { backgroundColor, accentColor };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
