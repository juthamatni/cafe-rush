const RECIPES = {
    "Espresso": ["Espresso"],
    "Latte": ["Espresso", "Milk"],
    "Americano": ["Espresso", "Water"],
    "Sweet Latte": ["Espresso", "Milk", "Syrup"]
};

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

function addCustomerOrder() {
    const menus = Object.keys(RECIPES);
    const randomMenu = menus[Math.floor(Math.random() * menus.length)];
    const randomTime = Math.floor(Math.random() * 25) + 15;

    const newOrder = {
        id: Date.now(),
        menu: randomMenu,
        recipe: RECIPES[randomMenu],
        timeLeft: randomTime
    };

    customerQueue.enqueue(newOrder);
    renderQueue();
}

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
        queueDiv.innerHTML = "<p style='color:#888;'>ไม่มีคิวลูกค้าในขณะนี้</p>";
        currentOrderText.innerText = "ไม่มีลูกค้า";
        return;
    }

    currentOrderText.innerText = `${customerQueue.peek().menu} (สูตร: ${customerQueue.peek().recipe.join(" + ")})`;

    customerQueue.orders.forEach((order, index) => {
        const card = document.createElement("div");
        card.className = `order-card ${order.timeLeft <= 15 ? 'urgent' : ''}`;
        card.innerHTML = `
            <span><b>คิวที่ ${index + 1}:</b> ${order.menu}</span>
            <span>⏳ เหลือเวลา: ${order.timeLeft}s</span>
        `;
        queueDiv.appendChild(card);
    });
}

setInterval(() => {
    if (!customerQueue.isEmpty()) {
        customerQueue.orders.forEach(order => order.timeLeft--);
        customerQueue.orders = customerQueue.orders.filter(order => order.timeLeft > 0);
        renderQueue();
    }
}, 1000);
