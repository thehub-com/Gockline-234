const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

/* =======================
   ПРОСТАЯ БАЗА (JSON)
======================= */
const DB_PATH = path.join(__dirname, "db.json");

let db = {
  users: {},      // token -> { id, nick }
  messages: []    // { from, to, text, time }
};

if (fs.existsSync(DB_PATH)) {
  db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

/* =======================
   РЕГИСТРАЦИЯ
======================= */
app.post("/register", (req, res) => {
  const { nick } = req.body;
  if (!nick) return res.status(400).json({ error: "No nick" });

  const token = Math.random().toString(36).slice(2);
  const id = Date.now().toString();

  db.users[token] = { id, nick };
  saveDB();

  res.json({ token, id, nick });
});

/* =======================
   ПРОВЕРКА ТОКЕНА
======================= */
app.post("/login", (req, res) => {
  const { token } = req.body;
  if (!db.users[token]) return res.status(401).end();
  res.json(db.users[token]);
});

/* =======================
   WEBSOCKET ЧАТ
======================= */
const sockets = new Map(); // ws -> user

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    // авторизация
    if (msg.type === "auth") {
      const user = db.users[msg.token];
      if (!user) return ws.close();
      sockets.set(ws, user);
      ws.send(JSON.stringify({
        type: "history",
        messages: db.messages.filter(
          m => m.from === user.id || m.to === user.id
        )
      }));
      return;
    }

    const user = sockets.get(ws);
    if (!user) return;

    // сообщение
    if (msg.type === "text") {
      const message = {
        from: user.id,
        to: msg.to,
        text: msg.text,
        time: Date.now()
      };

      db.messages.push(message);
      saveDB();

      // рассылаем всем
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "text",
            ...message
          }));
        }
      });
    }
  });

  ws.on("close", () => {
    sockets.delete(ws);
  });
});

/* =======================
   START
======================= */
server.listen(PORT, () => {
  console.log("SERVER RUNNING ON", PORT);
});
