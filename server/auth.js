const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

/* ===== загрузка базы ===== */
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, messages: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

/* ===== сохранение базы ===== */
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* ===== регистрация ===== */
function register(nick) {
  const db = loadDB();

  const token = Math.random().toString(36).slice(2);
  const id = Date.now().toString();

  db.users[token] = { id, nick };
  saveDB(db);

  return { token, id, nick };
}

/* ===== проверка токена ===== */
function auth(token) {
  const db = loadDB();
  return db.users[token] || null;
}

module.exports = {
  register,
  auth,
  loadDB,
  saveDB
};
