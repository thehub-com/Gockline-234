import express from "express";
import cors from "cors";
import { checkToken } from "./auth.js";
import "./bot.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(400);

  const user = checkToken(token);
  if (!user) return res.sendStatus(401);

  res.json({ ok: true, user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("GockLine server running on", PORT);
});
