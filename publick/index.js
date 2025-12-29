const API = location.origin;
const WS  = API.replace("http", "ws");

let socket = null;
let myNick = null;
let current = null;

/* 🔐 LOGIN */
async function login() {
  const code = document.getElementById("code").value.trim();
  if (!code) return alert("Введите код");

  const r = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });

  if (!r.ok) return alert("Неверный код");

  const data = await r.json();
  myNick = data.nick;

  document.getElementById("auth").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("me").innerText = myNick;

  socket = new WebSocket(WS);
  socket.onmessage = e => handle(JSON.parse(e.data));
}

/* 👥 USERS (пока заглушка, сервер позже) */
function loadUsers() {
  const box = document.getElementById("users");
  box.innerHTML = "";

  ["admin", "test", "demo"].forEach(u => {
    if (u === myNick) return;
    const d = document.createElement("div");
    d.className = "user";
    d.innerText = u;
    d.onclick = () => openChat(u);
    box.appendChild(d);
  });
}

/* 💬 CHAT */
function openChat(nick) {
  current = nick;
  document.getElementById("chatName").innerText = nick;
  document.getElementById("chat").classList.remove("hidden");
  document.getElementById("messages").innerHTML = "";
}

function closeChat() {
  document.getElementById("chat").classList.add("hidden");
}

/* ✉️ SEND */
function send() {
  const t = document.getElementById("text");
  if (!t.value || !current) return;

  socket.send(JSON.stringify({
    type: "msg",
    to: current,
    text: t.value,
    time: Date.now()
  }));

  renderMsg({ text: t.value, me: true });
  t.value = "";
}

/* 📩 HANDLE */
function handle(m) {
  if (m.type === "msg") renderMsg(m);
  if (m.type === "fire") updateFire(m.count);
}

/* 🧱 RENDER */
function renderMsg(m) {
  const el = document.createElement("div");
  el.className = "msg " + (m.me ? "me" : "");
  el.innerText = m.text;

  const box = document.getElementById("messages");
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

/* 🔥 STREAK */
function updateFire(count) {
  const f = document.getElementById("fire");
  f.innerText = count > 1 ? "🔥 " + count : "";
    }
