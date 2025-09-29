// script.js
let cart = [];
// NEW: Global array to store all products fetched from the server
let allProducts = []; 
// NEW: Global array defining the product IDs for the Hot Deals section
const HOT_DEAL_IDS = [5, 6, 13, 14];

// NEW FUNCTION: Handles location selection/update
function setLocation() {
    // 1. Prompt the user for a new location
    const newLocation = prompt("Enter your delivery location (e.g., 'HSR Layout, Bangalore' or 'Mumbai'):");

    // 2. Check if the user entered a value and didn't just press Cancel
    if (newLocation && newLocation.trim() !== "") {
        // 3. Update the display text
        const locationDiv = document.getElementById('location-display');
        locationDiv.innerHTML = `
            <h4>Delivering to: ${newLocation.trim()}<br>
            <span style="font-weight: normal; font-size: 0.9em; color: gray;">Click to change location</span></h4>
        `;
    } else if (newLocation === "") {
        // Handle case where user clears the prompt
        alert("Location cannot be empty. Please enter a location.");
    }
}

// Fetch and display products
async function loadProducts() {
  const res = await fetch("/api/products");
  
  if (!res.ok) {
    console.error("Failed to fetch products from /api/products");
    document.getElementById("json-products").innerHTML = "<p style='color:red;'>Error loading products. Is server.js running?</p>";
    return;
  }

  // Store the fetched products globally
  allProducts = await res.json(); 

  // CHANGED: Use filter to select non-contiguous IDs for Hot Deals
  const hotDeals = allProducts.filter(p => HOT_DEAL_IDS.includes(p.id));
  renderHotDeals(hotDeals); 

  // Render the dynamic Instamart Specials (all products)
  renderProducts(allProducts);
}

// Function to render the dynamic Instamart Specials
function renderProducts(productsToRender) {
  const container = document.getElementById("json-products"); 
  container.innerHTML = "";
  
  if (productsToRender.length === 0) {
      container.innerHTML = "<p>No products found matching your search.</p>";
      return;
  }

  productsToRender.forEach(p => {
    const item = document.createElement("div");
    item.className = "oneproduct js-product"; 
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${parseFloat(p.price).toFixed(2)}</p> 
      <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})">Add to Cart</button>
    `;
    container.appendChild(item);
  });
}

// Function to render the Hot Deals section
function renderHotDeals(productsToRender) {
  const container = document.getElementById("hot-deals-products");
  container.innerHTML = "";

  if (productsToRender.length === 0) {
      // Keep it empty if no matches in the hot deals list during search
      return;
  }

  productsToRender.forEach(p => {
    const item = document.createElement("div");
    item.className = "oneproduct js-product"; 
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${parseFloat(p.price).toFixed(2)}</p> 
      <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})">Add to Cart</button>
    `;
    container.appendChild(item);
  });
}

// Search/Filter function
function filterProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  // 1. Filter the main product list (Dynamically Loaded)
  const filteredProducts = allProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
  );

  // 2. Filter the Hot Deals
  const filteredHotDeals = allProducts
      .filter(p => HOT_DEAL_IDS.includes(p.id))
      .filter(p => p.name.toLowerCase().includes(searchTerm));

  // Re-render both dynamic sections with filtered results
  renderHotDeals(filteredHotDeals);
  renderProducts(filteredProducts);
  
  // 3. FIX: Filter the static "Grocery & Kitchen" products
  const staticProductsContainer = document.getElementById('static-products');
  if (staticProductsContainer) {
    // Select all product cards in the static section
    const staticProducts = staticProductsContainer.querySelectorAll('.js-product');

    staticProducts.forEach(product => {
        // Extract the product name from the h3 tag
        const name = product.querySelector('h3').textContent.toLowerCase();
        
        // Hide/Show element based on search term
        if (name.includes(searchTerm)) {
            // Set to empty string to revert to CSS default display (likely flex/block)
            product.style.display = ''; 
        } else {
            product.style.display = 'none'; 
        }
    });
  }
}

// Add product to cart
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    // Ensure price is stored as a number
    cart.push({ id, name, price: parseFloat(price), qty: 1 });
  }
  renderCart();
}

// Render cart
function renderCart() {
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Cart is empty.</p>";
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      ${item.name} x ${item.qty} = **₹${(item.price * item.qty).toFixed(2)}**
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    cartContainer.appendChild(row);
  });

  document.getElementById("total").innerText = "Total: ₹" + total.toFixed(2);
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

// Checkout
async function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart)
    });

    const data = await res.json();
    alert(data.message);

    // Clear cart after successful checkout
    cart = [];
    renderCart();

  } catch (error) {
    alert("Checkout failed. Check if server.js is running.");
    console.error("Checkout error:", error);
  }
}

// Load products on page start
window.onload = loadProducts;