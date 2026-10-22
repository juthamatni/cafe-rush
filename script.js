const RECIPES = {
    "Espresso": ["Espresso"],
    "Latte": ["Espresso", "Milk"],
    "Americano": ["Espresso", "Water"],
    "Sweet Latte": ["Espresso", "Milk", "Syrup"]
};

// 1. โครงสร้างข้อมูล Queue
class OrderQueue {
    constructor() {
        this.orders = [];
    }
    enqueue(order) { this.orders.push(order); }
    dequeue() { return this.orders.shift(); }
    peek() { return this.orders[0]; }
    isEmpty() { return this.orders.length === 0; }
}

const customerQueue = new OrderQueue();
let currentCup = [];
let score = 0;
let servedCount = 0;
const MAX_QUEUE_SIZE = 5; // จำกัดคิวสูงสุดในร้านไม่เกิน 5 คน

// ฟังก์ชันสุ่มสร้างลูกค้าใหม่เข้า Queue
function addCustomerOrder() {
    // ถ้าคิวเต็มแล้ว จะยังไม่สร้างลูกค้าเพิ่ม
    if (customerQueue.orders.length >= MAX_QUEUE_SIZE) return;

    const menus = Object.keys(RECIPES);
    const randomMenu = menus[Math.floor(Math.random() * menus.length)];
    const randomTime = Math.floor(Math.random() * 15) + 15; // เวลา 15-30 วินาที

    const newOrder = {
        id: Date.now(),
        menu: randomMenu,
        recipe: RECIPES[randomMenu],
        timeLeft: randomTime
    };

    customerQueue.enqueue(newOrder);
    renderQueue();
}

// 2. ฟังก์ชัน Sorting เรียงลำดับคิวตามเวลาเร่งด่วน (เวลาเหลือน้อยที่สุด)
function handleSortOrders() {
    if (customerQueue.isEmpty()) return;
    customerQueue.orders.sort((a, b) => a.timeLeft - b.timeLeft);
    renderQueue();
}

function addIngredient(item) {
    currentCup.push(item);
    document.getElementById("cup-contents").innerText = currentCup.join(" + ");
}

function clearCup() {
    currentCup = [];
    document.getElementById("cup-contents").innerText = "ว่างเปล่า";
}

// เสิร์ฟออเดอร์แรก (Dequeue)
function serveFirstCustomer() {
    if (customerQueue.isEmpty()) return alert("ไม่มีลูกค้าในคิว!");

    const currentOrder = customerQueue.peek();
    const isCorrect = JSON.stringify(currentCup.sort()) === JSON.stringify([...currentOrder.recipe].sort());

    if (isCorrect) {
        score += 20;
        servedCount++;
        alert(`✨ เสิร์ฟเมนู ${currentOrder.menu} สำเร็จ! +20 คะแนน`);
        customerQueue.dequeue();
        clearCup();
        document.getElementById("score").innerText = score;
        document.getElementById("served-count").innerText = servedCount;
        renderQueue();
    } else {
        alert("❌ ส่วนผสมไม่ถูกต้อง! ลองทำใหม่อีกครั้ง");
    }
}

function renderQueue() {
    const queueDiv = document.getElementById("queue-display");
    const currentOrderText = document.getElementById("current-order-name");
    queueDiv.innerHTML = "";

    if (customerQueue.isEmpty()) {
        queueDiv.innerHTML = "<p style='color:#888;'>กำลังรอสุ่มลูกค้าใหม่เข้าคิว...</p>";
        currentOrderText.innerText = "ไม่มีลูกค้า";
        return;
    }

    currentOrderText.innerText = `${customerQueue.peek().menu} (สูตร: ${customerQueue.peek().recipe.join(" + ")})`;

    customerQueue.orders.forEach((order, index) => {
        const card = document.createElement("div");
        card.className = `order-card ${order.timeLeft <= 10 ? 'urgent' : ''}`;
        card.innerHTML = `
            <span><b>คิวที่ ${index + 1}:</b> ${order.menu}</span>
            <span>⏳ เหลือเวลา: ${order.timeLeft}s</span>
        `;
        queueDiv.appendChild(card);
    });
}

// -------------------------------------------------------------
// ระบบอัตโนมัติ (Timers)
// -------------------------------------------------------------

// 1. สุ่มสร้างลูกค้าใหม่เข้าคิวอัตโนมัติทุกๆ 4 วินาที
setInterval(() => {
    addCustomerOrder();
}, 4000);

// 2. ตัวนับเวลาถอยหลังออเดอร์ทุกๆ 1 วินาที
setInterval(() => {
    if (!customerQueue.isEmpty()) {
        customerQueue.orders.forEach(order => order.timeLeft--);
        // ลบออเดอร์ที่หมดเวลาออกจาก Queue อัตโนมัติ
        customerQueue.orders = customerQueue.orders.filter(order => order.timeLeft > 0);
        renderQueue();
    }
}, 1000);

// สร้างลูกค้าคนแรกทันทีเมื่อเปิดเกม
addCustomerOrder();
