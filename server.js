const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbFile = path.join(__dirname, "db.json");

// Загружаем базу
function loadDB() {
  if (!fs.existsSync(dbFile)) return [];
  return JSON.parse(fs.readFileSync(dbFile));
}

// Сохраняем базу
function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Админка
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Добавить новый промокод
app.post("/admin/add", (req, res) => {
  const { code, text, link } = req.body;
  if (!code || !text || !link) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }
  const db = loadDB();
  db.push({ code, text, link });
  saveDB(db);
  res.json({ success: true });
});

// Список всех промокодов
app.get("/admin/list", (req, res) => {
  res.json(loadDB());
});

// Удалить промокод
app.post("/admin/delete", (req, res) => {
  const { code } = req.body;
  let db = loadDB();
  db = db.filter(c => c.code !== code);
  saveDB(db);
  res.json({ success: true });
});

// Проверка промокода
app.post("/check", (req, res) => {
  const { code } = req.body;
  const db = loadDB();
  const found = db.find(c => c.code === code);
  if (found) {
    res.json({ success: true, text: found.text, link: found.link });
  } else {
    res.json({ success: false });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
