const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "TECH",
    price: 89,
  },
  {
    id: 2,
    name: "Classic Watch",
    category: "ACCESSORIES",
    price: 65,
  },
  {
    id: 3,
    name: "Everyday Backpack",
    category: "LIFESTYLE",
    price: 49,
  },
  {
    id: 4,
    name: "Minimal Desk Lamp",
    category: "HOME",
    price: 35,
  },
];

let cart = JSON.parse(localStorage.getItem("minishop-cart")) || [];

const cartButton = document.querySelector(".cart-btn");
const cartCount = cartButton.querySelector("span");

const overlay = document.createElement("div");
overlay.className = "cart-overlay";

const cartPanel = document.createElement("aside");
cartPanel.className = "cart-panel";

cartPanel.innerHTML = `
    <div class="cart-header">
        <h2>Your cart</h2>
        <button class="close-cart">×</button>
    </div>

    <div class="cart-items"></div>

    <div class="cart-footer">
        <div class="cart-total">
            <span>Total</span>
            <strong class="total-price">$0.00</strong>
        </div>

        <button class="checkout-btn">Checkout</button>
    </div>
`;

document.body.append(overlay, cartPanel);

const cartItemsContainer = document.querySelector(".cart-items");
const totalPriceElement = document.querySelector(".total-price");

// Add product prices and buttons
document.querySelectorAll(".product-card").forEach((card, index) => {
  const product = products[index];

  card.querySelector(".product-price").textContent =
    `$${product.price.toFixed(2)}`;

  const button = document.createElement("button");
  button.className = "add-cart-btn";
  button.textContent = "Add to cart";

  button.addEventListener("click", () => {
    addToCart(product.id);
  });

  card.querySelector(".product-info").appendChild(button);
});

// Open and close cart
function openCart() {
  overlay.classList.add("open");
  cartPanel.classList.add("open");
}

function closeCart() {
  overlay.classList.remove("open");
  cartPanel.classList.remove("open");
}

cartButton.addEventListener("click", openCart);

document.querySelector(".close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

button.addEventListener("click", () => {
  addToCart(product.id);

  // Give visual feedback to the user
  button.textContent = "Added!";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = "Add to cart";
    button.disabled = false;
  }, 1000);
});

// Cart operations
function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1,
    });
  }

  updateCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find((item) => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Refresh cart display and save data
function updateCart() {
  localStorage.setItem("minishop-cart", JSON.stringify(cart));

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalItems;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <p class="cart-empty">Your cart is empty.</p>
        `;
  }

  let totalPrice = 0;

  cart.forEach((item) => {
    const product = products.find((product) => product.id === item.id);

    if (!product) return;

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
            <div>
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)} each</p>

                <div class="cart-controls">
                    <button class="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>

            <div>
                <p>$${itemTotal.toFixed(2)}</p>
                <button class="remove-item">Remove</button>
            </div>
        `;

    cartItem
      .querySelector(".decrease")
      .addEventListener("click", () => changeQuantity(product.id, -1));

    cartItem
      .querySelector(".increase")
      .addEventListener("click", () => changeQuantity(product.id, 1));

    cartItem
      .querySelector(".remove-item")
      .addEventListener("click", () => removeFromCart(product.id));

    cartItemsContainer.appendChild(cartItem);
  });

  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Simple checkout demo
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thanks for shopping at MiniShop!");

  cart = [];
  updateCart();
  closeCart();
});

// Load saved cart when the page opens
updateCart();
// Product search
const searchInput = document.getElementById("product-search");
const productCards = document.querySelectorAll(".product-card");

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase().trim();

  productCards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase();

    card.style.display = productName.includes(searchValue) ? "block" : "none";
  });
});
