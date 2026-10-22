// IMPORTANT: Replace this placeholder with your WhatsApp number, including India's country code.
// Example format: "919876543210" (digits only, no +, spaces, or hyphens).
const WHATSAPP_NUMBER = +917544007792;

// Sale prices and original crossed-out prices (in INR).
const CAR_PRICE = 299;
const CAR_OLD_PRICE = 499;
const ROOM_PRICE = 599;
const ROOM_OLD_PRICE = 999;

const fragrances = [
  { name: "Pacific", slug: "pacific", description: "A fresh, ocean-inspired fragrance for a refreshing everyday atmosphere." },
  { name: "Rubaab", slug: "rubaab", description: "A confident, sophisticated scent for those who appreciate a bold impression." },
  { name: "Mehfil", slug: "mehfil", description: "A warm, inviting fragrance to make your surroundings feel special." },
  { name: "Fitoor", slug: "fitoor", description: "A captivating fragrance for memorable moments and distinctive spaces." },
  { name: "Clubman", slug: "clubman", description: "A refined, confident fragrance for your everyday journeys." },
  { name: "White Orchid", slug: "white-orchid", description: "An elegant floral-inspired scent with a soft, sophisticated character." },
  { name: "Citrus Splash", slug: "citrus-splash", description: "A bright citrus-inspired scent with an uplifting feel." }
];

const products = fragrances.flatMap(fragrance => [
  {
    id: `${fragrance.slug}-car`, name: fragrance.name, slug: fragrance.slug,
    type: "Car Perfume", category: "car", price: CAR_PRICE, oldPrice: CAR_OLD_PRICE,
    image: `images/${fragrance.slug}-car.jpg`, description: fragrance.description
  },
  {
    id: `${fragrance.slug}-room`, name: fragrance.name, slug: fragrance.slug,
    type: "Room Spray", category: "room", price: ROOM_PRICE, oldPrice: ROOM_OLD_PRICE,
    image: `images/${fragrance.slug}-room.jpg`, description: fragrance.description
  }
]);

let cart = [];
try {
  const savedCart = JSON.parse(localStorage.getItem("amriadCart") || "[]");
  cart = Array.isArray(savedCart) ? savedCart : [];
} catch {
  cart = [];
}

function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function productCard(product) {
  const safeName = escapeHTML(product.name);
  const safeType = escapeHTML(product.type);
  const safeDescription = escapeHTML(product.description);
  const safeId = escapeHTML(product.id);
  const safeImage = escapeHTML(product.image);
  return `
    <article class="product-card">
      <div class="flip-card" tabindex="0" role="button"
           aria-label="View details for ${safeName} ${safeType}" aria-pressed="false">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="${safeImage}" alt="${safeName} ${safeType}" loading="lazy"
                 onerror="this.onerror=null;this.src='images/product-placeholder.svg'">
            <div class="front-info">
              <h3>${safeName}</h3>
              <p class="product-type">${safeType}</p>
              <div class="front-bottom">
                <div class="price-line">
                  <span class="old-price">${formatPrice(product.oldPrice)}</span>
                  <span class="sale-price">${formatPrice(product.price)}</span>
                </div>
                <span class="flip-label">VIEW DETAILS ↗</span>
              </div>
            </div>
          </div>
          <div class="flip-card-back">
            <p class="eyebrow">AMRIAD FRAGRANCES</p>
            <h3>${safeName}</h3>
            <p class="back-type">${safeType}</p>
            <p class="back-description">${safeDescription}</p>
            <div class="back-price">
              <span class="old-price">${formatPrice(product.oldPrice)}</span>
              <span class="sale-price">${formatPrice(product.price)}</span>
            </div>
            <button class="primary-button add-cart-button" data-product-id="${safeId}">Add to Cart</button>
            <p class="flip-back-hint">Tap the card to flip back</p>
          </div>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const search = (document.getElementById("productSearch")?.value || "").trim().toLowerCase();
  const category = document.getElementById("categoryFilter")?.value || "all";
  const sort = document.getElementById("sortProducts")?.value || "default";

  let filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search) ||
      product.type.toLowerCase().includes(search);
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = filtered.map(productCard).join("");
  const count = document.getElementById("productCount");
  if (count) count.textContent = `${filtered.length} products`;

  const empty = document.getElementById("emptyState");
  if (empty) empty.hidden = filtered.length !== 0;
}

function renderFeaturedProducts() {
  const grid = document.getElementById("featuredProducts");
  if (!grid) return;
  const featuredIds = ["pacific-room", "rubaab-car", "white-orchid-room", "citrus-splash-car"];
  grid.innerHTML = featuredIds
    .map(id => products.find(product => product.id === id))
    .filter(Boolean)
    .map(productCard).join("");
}

document.addEventListener("click", event => {
  const addButton = event.target.closest(".add-cart-button");
  if (addButton) {
    event.stopPropagation();
    addToCart(addButton.dataset.productId);
    return;
  }

  const card = event.target.closest(".flip-card");
  if (card) {
    card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", card.classList.contains("is-flipped") ? "true" : "false");
  }
});

document.addEventListener("keydown", event => {
  const card = event.target.closest(".flip-card");
  if (card && event.target === card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", card.classList.contains("is-flipped") ? "true" : "false");
  }
});

function saveCart() {
  try { localStorage.setItem("amriadCart", JSON.stringify(cart)); } catch {}
  renderCart();
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({
    id: product.id, name: product.name, type: product.type,
    price: product.price, oldPrice: product.oldPrice, quantity: 1
  });

  saveCart();
  openCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find(product => product.id === productId);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== productId);
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(product => product.id !== productId);
  saveCart();
}

function renderCart() {
  const count = document.getElementById("cartCount");
  const itemsContainer = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");
  const subtotalElement = document.getElementById("cartSubtotal");

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (count) count.textContent = totalQuantity;

  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <p>${escapeHTML(item.type)}</p>
          <p><span class="old-price">${formatPrice(item.oldPrice || item.price)}</span>
             <span class="sale-price">${formatPrice(item.price)}</span> each</p>
          <button onclick="changeQuantity('${escapeHTML(item.id)}', -1)" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${escapeHTML(item.id)}', 1)" aria-label="Increase quantity">+</button>
        </div>
        <div>
          <strong>${formatPrice(item.price * item.quantity)}</strong><br>
          <button onclick="removeFromCart('${escapeHTML(item.id)}')">Remove</button>
        </div>
      </div>`).join("");
  }

  if (empty) empty.hidden = cart.length !== 0;
  if (footer) footer.hidden = cart.length === 0;
  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
}

function checkoutWhatsApp() {
  if (!cart.length) return;
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    alert("Please update WHATSAPP_NUMBER in script.js with your WhatsApp number and country code.");
    return;
  }

  const lines = cart.map(item =>
    `${item.name} - ${item.type} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
  );
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = [
    "Hello AMRIAD, I would like to place an order:", "",
    ...lines, "", `Subtotal: ${formatPrice(subtotal)}`, "",
    "Please confirm availability, delivery charges, and next steps."
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderFeaturedProducts();
  renderCart();

  document.getElementById("productSearch")?.addEventListener("input", renderProducts);
  document.getElementById("categoryFilter")?.addEventListener("change", renderProducts);
  document.getElementById("sortProducts")?.addEventListener("change", renderProducts);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
