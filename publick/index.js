import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { checkToken } from "./auth.js";
import "./bot.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 раздаём frontend
app.use(express.static(path.join(__dirname, "../public")));

app.post("/login", (req, res) => {
  const { code } = req.body; // ← ВАЖНО
  if (!code) return res.sendStatus(400);

  const user = checkToken(code);
  if (!user) return res.sendStatus(401);

  res.json({ nick: user.nick });
});

// fallback для SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("GockLine server running on", PORT);
});
