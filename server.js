const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let codes = [];
let settings = {
  backgroundColor: "#000000",
  accentColor: "#ff337a"
};

// === API для промокодов ===
app.post("/check-code", (req, res) => {
  const { code } = req.body;
  const entry = codes.find(c => c.code === code);

  if (entry) {
    res.json({
      success: true,
      text: entry.text,
      file: entry.file,
      settings
    });
  } else {
    res.json({ success: false, settings });
  }
});

// === Админка ===
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/admin/list", (req, res) => {
  res.json(codes);
});

app.post("/admin/add", multer().none(), (req, res) => {
  const { code, text, file } = req.body;
  codes.push({ code, text, file });
  res.sendStatus(200);
});

app.post("/admin/delete", (req, res) => {
  const { code } = req.body;
  codes = codes.filter(c => c.code !== code);
  res.sendStatus(200);
});

// === Настройки цветов ===
app.get("/admin/settings", (req, res) => {
  res.json(settings);
});

app.post("/admin/settings", (req, res) => {
  const { backgroundColor, accentColor } = req.body;
  if (backgroundColor) settings.backgroundColor = backgroundColor;
  if (accentColor) settings.accentColor = accentColor;
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
