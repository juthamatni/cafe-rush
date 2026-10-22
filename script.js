
const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const message = document.getElementById("message");
const orderList = document.getElementById("orderList");

const menu = [
  { name: "กาแฟ", emoji: "☕", points: 10 },
  { name: "ชาเขียว", emoji: "🍵", points: 15 },
  { name: "โกโก้", emoji: "🥤", points: 12 },
  { name: "ครัวซองต์", emoji: "🥐", points: 8 },
  { name: "เค้ก", emoji: "🍰", points: 20 }
];

let orders = [];
let score = 0;
let timeLeft = 60;
let timer = null;
let nextId = 1;
let playing = false;

function startGame() {
  clearInterval(timer);

  orders = [];
  score = 0;
  timeLeft = 60;
  nextId = 1;
  playing = true;

  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  orderList.innerHTML = "";
  message.textContent = "รับออเดอร์ให้ทันเวลากันเลย!";
  startBtn.textContent = "เริ่มเกมใหม่";

  addOrder();
  addOrder();
  addOrder();

  timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function addOrder() {
  if (!playing || orders.length >= 8) return;

  const item = menu[Math.floor(Math.random() * menu.length)];

  orders.push({
    id: nextId++,
    name: item.name,
    emoji: item.emoji,
    points: item.points,
    deadline: timeLeft
  });

  renderOrders();
}

function renderOrders() {
  orderList.innerHTML = "";

  orders.forEach((order, index) => {
    const card = document.createElement("div");
    card.className = "order";

    const info = document.createElement("span");
    info.textContent =
      `${order.emoji} ${order.name} · ${order.points} คะแนน`;

    const serveBtn = document.createElement("button");
    serveBtn.textContent = "เสิร์ฟ";
    serveBtn.disabled = !playing;
    serveBtn.addEventListener("click", () => serveOrder(order.id));

    card.append(info, serveBtn);
    orderList.appendChild(card);
  });

  if (playing) {
    const addBtn = document.createElement("button");
    addBtn.textContent = "➕ รับออเดอร์ใหม่";
    addBtn.addEventListener("click", addOrder);
    addBtn.disabled = orders.length >= 8;
    orderList.appendChild(addBtn);

    const sortBtn = document.createElement("button");
    sortBtn.textContent = "เรียงตามคะแนนมากไปน้อย";
    sortBtn.addEventListener("click", sortOrders);
    orderList.appendChild(sortBtn);
  }
}

function serveOrder(id) {
  if (!playing) return;

  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return;

  // Queue: ให้ทำออเดอร์ที่เข้าคิวก่อนเท่านั้น
  if (index !== 0) {
    message.textContent = "ทำออเดอร์แรกในคิวก่อนนะ!";
    return;
  }

  const completed = orders.shift();
  score += completed.points;
  scoreText.textContent = score;
  message.textContent = `เสิร์ฟ${completed.name}สำเร็จ! +${completed.points} คะแนน`;

  addOrder();
  renderOrders();
}

function sortOrders() {
  if (!playing) return;

  // Sorting: เรียงออเดอร์ตามคะแนนจากมากไปน้อย
  orders.sort((a, b) => b.points - a.points);

  renderOrders();
  message.textContent = "เรียงออเดอร์ตามคะแนนแล้ว";
}

function endGame() {
  playing = false;
  clearInterval(timer);
  renderOrders();
  message.textContent = `หมดเวลา! ได้ทั้งหมด ${score} คะแนน`;
  startBtn.textContent = "เล่นอีกครั้ง";
}

startBtn.addEventListener("click", startGame);
