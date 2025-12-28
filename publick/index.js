const API = location.origin;
const WS  = API.replace("https","wss");

let socket;
let myNick;
let current;

async function login(){
  const code = document.getElementById("code").value;
  const r = await fetch(API+"/login",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({code})
  });

  if(!r.ok) return alert("Неверный код");

  const data = await r.json();
  myNick = data.nick;

  document.getElementById("auth").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("me").innerText = myNick;

  socket = new WebSocket(WS);
  socket.onmessage = e => handle(JSON.parse(e.data));

  loadUsers();
}

async function loadUsers(){
  const r = await fetch(API+"/users");
  const list = await r.json();

  const box = document.getElementById("users");
  box.innerHTML = "";

  list.forEach(u=>{
    if(u===myNick) return;
    const d = document.createElement("div");
    d.className="user";
    d.innerText=u;
    d.onclick=()=>openChat(u);
    box.appendChild(d);
  });
}

function openChat(n){
  current=n;
  document.getElementById("chatName").innerText=n;
  document.getElementById("chat").classList.remove("hidden");
  document.getElementById("messages").innerHTML="";
}

function closeChat(){
  document.getElementById("chat").classList.add("hidden");
}

function send(){
  const t=document.getElementById("text");
  if(!t.value) return;

  socket.send(JSON.stringify({
    type:"msg",
    to:current,
    text:t.value,
    time:Date.now()
  }));

  t.value="";
}

function handle(m){
  if(m.type==="msg"){
    const el=document.createElement("div");
    el.className="msg "+(m.me?"me":"");
    el.innerText=m.text;
    document.getElementById("messages").appendChild(el);
  }

  if(m.type==="fire"){
    document.getElementById("fire").innerText = m.count>1 ? "🔥 "+m.count : "";
  }
      }
