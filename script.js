

// Coffee menu data
const menuItems = [
  { name: "Cappuccino", image: "images/cappuccino.jpg", price: 150 },
  { name: "Espresso", image: "images/espresso.jpg", price: 120 },
  { name: "Latte", image: "images/latte.jpg", price: 200 },
  { name: "Mocha", image: "images/mocha.jpg", price: 180 },
  { name: "Cold Brew", image: "images/cold_brew_coffee.jpg", price: 170 },
  { name: "Caramel Latte", image: "images/caramel_latte.jpg", price: 190 },
];

// Display menu dynamically
const menuGrid = document.getElementById("menuGrid");
menuItems.forEach((item, index) => {
  const card = document.createElement("div");
  card.classList.add("menu-card");
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.price} Tk</p>
    <button class="order-btn" onclick="addToCart(${index})">Add to Cart</button>
  `;
  menuGrid.appendChild(card);
});

// Cart functionality
let cart = [];

function addToCart(index) {
  const selectedItem = menuItems[index];
  cart.push(selectedItem);
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartList.innerHTML = "";

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.price} Tk 
      <button style="margin-left:10px; background:#ff6f61; color:white; border:none; border-radius:5px; cursor:pointer;" 
        onclick="removeItem(${i})">Remove</button>`;
    cartList.appendChild(li);
  });

  cartTotal.textContent = `Total: ${total} Tk`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// Place Order (send to backend)
async function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const response = await fetch("http://localhost:3000/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });

  const data = await response.json();
  alert(data.message);
  cart = [];
  updateCart();
}

// Submit Feedback (send to backend)
async function submitFeedback() {
  const name = document.getElementById("fbName").value;
  const email = document.getElementById("fbEmail").value;
  const text = document.getElementById("fbText").value;

  if (text.trim() === "") {
    alert("Please write some feedback before submitting.");
    return;
  }

  const feedback = { name, email, text };

  const res = await fetch("http://localhost:3000/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
  });

  const data = await res.json();
  alert(data.message);

  // clear form
  document.getElementById("feedbackForm").reset();
}
