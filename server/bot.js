import TelegramBot from "node-telegram-bot-api";
import { createUser } from "./auth.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, msg => {
  const token = createUser(msg.from);

  bot.sendMessage(
    msg.chat.id,
    `👋 Привет!\n\n🔐 ТВОЙ ТОКЕН:\n\n\`${token}\`\n\nВставь его в приложении GockLine`,
    { parse_mode: "Markdown" }
  );
});
