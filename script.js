const productsContainer = document.getElementById("products");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("search");

let ADMIN_KEY = null;
let products = [];
let cartArray = [];

/* ================= FETCH PRODUCTS ================= */
function fetchProducts() {
  fetch("http://localhost:8080/products")
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts(products);
    });
}

/* ================= RENDER PRODUCTS ================= */
function renderProducts(list) {
  productsContainer.innerHTML = list.map(p => `
    <div class="card">
      <img src="http://localhost:8080${p.img}" />

      <h3>${p.name}</h3>

      <p>
        <span style="text-decoration:line-through;color:#888">
          ₹${p.mrp}
        </span>
        <strong style="color:green"> ₹${p.price}</strong>
      </p>

      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
        Add to Cart
      </button>
    </div>
  `).join("");
}




/* ================= CART ================= */
function toggleCart() {
  cart.classList.toggle("open");
  renderCart();
}

function addToCart(id, name, price, originalPrice) {
  const item = cartArray.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cartArray.push({
      id,
      name,
      price,         // actual price
      originalPrice, // crossed price
      qty: 1
    });
  }
  renderCart();
}


function removeFromCart(id) {
  cartArray = cartArray.filter(i => i.id !== id);
  renderCart();
}

function changeQty(id, amount) {
  const item = cartArray.find(i => i.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) removeFromCart(id);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = cartArray.map(i => `
    <div class="cart-item">
      <span>${i.name} x ${i.qty}</span>
      <div class="cart-price">
        <span class="original-price">₹${i.originalPrice * i.qty}</span>
        <span class="discounted-price">₹${i.price * i.qty}</span>
      </div>
      <div class="cart-actions">
        <button onclick="changeQty(${i.id}, -1)">-</button>
        <button onclick="changeQty(${i.id}, 1)">+</button>
        <button onclick="removeFromCart(${i.id})">X</button>
      </div>
    </div>
  `).join("");

  cartCount.textContent = cartArray.reduce((a, b) => a + b.qty, 0);
  totalEl.textContent = cartArray.reduce((a, b) => a + b.price * b.qty, 0);
}


/* ================= SEARCH ================= */
searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
});

/* ================= ADMIN ================= */
if (confirm("Are you admin?")) {
  const key = prompt("Enter admin password:");
  if (key === "81787822") {
    ADMIN_KEY = key;
    document.getElementById("admin-panel").style.display = "block";
  } else {
    alert("Wrong admin password");
  }
}

/* ================= ADMIN ADD PRODUCT (PNG) ================= */
addForm.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", addForm.name.value);
  formData.append("mrp", addForm.mrp.value);
  formData.append("price", addForm.price.value);
  formData.append("img", addForm.img.files[0]);
  formData.append("key", "81787822");

  fetch("http://localhost:8080/add-product", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      addForm.reset();
      fetchProducts();
    })
    .catch(err => console.error(err));
});



/* ================= PURCHASE ================= */
function purchase() {
  if (cartArray.length === 0) return alert("Cart is empty");

  const name = document.getElementById("cust-name").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  if (!name || !address || !phone) return alert("Fill all details");

  let orderText = "";
  cartArray.forEach(i => orderText += `${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`);

  emailjs.send(
    "service_tgvp6kk",
    "template_o4nmme4",
    {
      customer_name: name,
      customer_address: address,
      customer_phone: phone,
      order_details: orderText,
      total_amount: totalEl.textContent
    }
  ).then(() => {
    alert("✅ Order placed successfully!");
    cartArray = [];
    renderCart();
    document.getElementById("cust-name").value = "";
    document.getElementById("cust-address").value = "";
    document.getElementById("cust-phone").value = "";
  }).catch(err => {
    console.error("EmailJS Error:", err);
    alert("❌ Failed to send order email");
  });
}

/* ================= INITIAL LOAD ================= */
fetchProducts();

productCard.innerHTML = `
  <img src="http://localhost:8080${p.img}">
  <h3>${p.name}</h3>
  <p class="mrp">₹${p.mrp}</p>
  <p class="price">₹${p.price}</p>
`;




