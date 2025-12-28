import fs from "fs";
import { v4 as uuid } from "uuid";

const USERS_FILE = "./users.json";

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

export function createUser(tgUser) {
  const users = readUsers();

  const token = uuid();
  users[token] = {
    id: tgUser.id,
    username: tgUser.username || "",
    first_name: tgUser.first_name || "",
    created: Date.now()
  };

  writeUsers(users);
  return token;
}

export function checkToken(token) {
  const users = readUsers();
  return users[token] || null;
}
