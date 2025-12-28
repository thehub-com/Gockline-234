const API = "https://gock-line.onrender.com"; // сервер

async function enter() {
  const token = document.getElementById("tokenInput").value.trim();
  if (!token) {
    alert("Введите токен");
    return;
  }

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    if (!res.ok) {
      alert("Неверный токен");
      return;
    }

    // временно просто успех
    document.getElementById("loginCard").innerHTML = `
      <h1>✅ Успешно</h1>
      <p class="subtitle">Сервер принял токен</p>
      <p style="opacity:.7;text-align:center">
        Чат и история будут после подключения сервера
      </p>
    `;
  } catch (e) {
    alert("Сервер недоступен");
  }
}
