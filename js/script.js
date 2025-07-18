// Shopcart E-Commerce JavaScript
// Author: Pixel-perfect, fully functional, vanilla JS only
// Features: Cart, Orders, Admin, Search, Filters, Validation, Responsive Nav, LocalStorage

// --- GLOBAL DATA & UTILITIES --- //

// Default product data (used if localStorage is empty)
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Wireless Earbuds, IPX8',
    desc: 'Organic Cotton, fairtrade certified',
    price: 89.99,
    category: 'Headphone',
    image: 'images/earbuds.png',
    rating: 4.8,
    ratingCount: 120,
    colors: ['#222', '#e74c3c', '#2980b9'],
    stock: 20
  },
  {
    id: 'p2',
    name: 'AirPods Max',
    desc: 'A perfect balance of high-fidelity audio',
    price: 559.00,
    category: 'Headphone',
    image: 'images/airpods-max.png',
    rating: 4.9,
    ratingCount: 121,
    colors: ['#e57373', '#222', '#b2dfdb', '#90caf9', '#cfd8dc'],
    stock: 12
  },
  {
    id: 'p3',
    name: 'Bose BT Earphones',
    desc: 'Take with air purifier, stained veneer/black',
    price: 199.00,
    category: 'Headphone',
    image: 'images/bose-bt.png',
    rating: 4.7,
    ratingCount: 98,
    colors: ['#222', '#90caf9'],
    stock: 8
  },
  {
    id: 'p4',
    name: 'V-FOX Headphones',
    desc: 'Wireless Headset with Mic',
    price: 39.00,
    category: 'Headphone',
    image: 'images/vfox.png',
    rating: 4.5,
    ratingCount: 77,
    colors: ['#e74c3c', '#222'],
    stock: 15
  },
  {
    id: 'p5',
    name: 'JBL TUNE 600BTNC',
    desc: 'Premium Bone Conduction Open Bluetooth',
    price: 89.00,
    category: 'Headphone',
    image: 'images/jbl600.png',
    rating: 4.6,
    ratingCount: 110,
    colors: ['#222'],
    stock: 10
  },
  {
    id: 'p6',
    name: 'TAGRY Bluetooth',
    desc: 'CVC 8.0, 6H Play, 4.0 GB',
    price: 109.00,
    category: 'Headphone',
    image: 'images/tagry.png',
    rating: 4.4,
    ratingCount: 80,
    colors: ['#222', '#90caf9'],
    stock: 9
  },
  {
    id: 'p7',
    name: 'Monster MNFLEX',
    desc: 'Air Active Noise Cancelling Bluetooth',
    price: 89.00,
    category: 'Headphone',
    image: 'images/monster.png',
    rating: 4.3,
    ratingCount: 65,
    colors: ['#e74c3c', '#222'],
    stock: 7
  },
  {
    id: 'p8',
    name: 'Beats solo3',
    desc: 'Wireless On-Ear Headphones',
    price: 199.99,
    category: 'Headphone',
    image: 'images/beats-solo3.png',
    rating: 4.8,
    ratingCount: 99,
    colors: ['#e74c3c', '#222', '#90caf9'],
    stock: 6
  }
];

const DEFAULT_CATEGORIES = [
  { name: 'Mac', icon: 'fa-laptop' },
  { name: 'iPad', icon: 'fa-tablet-screen-button' },
  { name: 'iPhone', icon: 'fa-mobile-screen-button' },
  { name: 'Watch', icon: 'fa-watch-apple' },
  { name: 'Vision', icon: 'fa-vr-cardboard' },
  { name: 'AirPods', icon: 'fa-headphones' },
  { name: 'TV & Home', icon: 'fa-tv' },
  { name: 'Entertainment', icon: 'fa-film' },
  { name: 'Accessories', icon: 'fa-keyboard' }
];

// --- LocalStorage Helpers --- //
function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || DEFAULT_PRODUCTS;
}
function setProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}
function setOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}
function getCategories() {
  return DEFAULT_CATEGORIES;
}

// --- Navbar Cart Count (All Pages) --- //
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
}

// --- Responsive Navbar Hamburger --- //
function setupNavbar() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.onclick = () => {
      mobileMenu.classList.toggle('active');
    };
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && e.target !== hamburger) {
        mobileMenu.classList.remove('active');
      }
    });
  }
}

// --- HOMEPAGE: Product Listing, Search, Category Filter --- //
function renderCategories() {
  const catList = document.getElementById('categoryList');
  if (!catList) return;
  const cats = getCategories();
  catList.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-item';
    btn.innerHTML = `<i class="fa-solid ${cat.icon}"></i> ${cat.name}`;
    btn.onclick = () => {
      document.getElementById('filterCategory').value = cat.name;
      filterAndRenderProducts();
    };
    catList.appendChild(btn);
  });
}

function renderProductGrid(products) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!products.length) {
    grid.innerHTML = '<p>No products found.</p>';
    return;
  }
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="product-desc">${product.desc}</div>
      <div class="product-rating">${'★'.repeat(Math.round(product.rating))}<span style="color:#888;font-size:0.95em;"> (${product.ratingCount})</span></div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="add-to-cart"><button class="btn-primary" data-id="${product.id}">Add to Cart</button></div>
    `;
    card.onclick = (e) => {
      if (e.target.tagName === 'BUTTON') return; // Let button handle
      window.location.href = `product.html?id=${product.id}`;
    };
    card.querySelector('button').onclick = (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
    };
    grid.appendChild(card);
  });
}

function filterAndRenderProducts() {
  let products = getProducts();
  const cat = document.getElementById('filterCategory')?.value;
  const price = document.getElementById('filterPrice')?.value;
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  if (cat && cat !== 'all') {
    products = products.filter(p => p.category === cat);
  }
  if (search) {
    products = products.filter(p => p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search));
  }
  if (price === 'low') {
    products = products.slice().sort((a, b) => a.price - b.price);
  } else if (price === 'high') {
    products = products.slice().sort((a, b) => b.price - a.price);
  }
  renderProductGrid(products);
}

function setupHomepage() {
  renderCategories();
  // Populate filter dropdown
  const catSel = document.getElementById('filterCategory');
  if (catSel) {
    catSel.innerHTML = '<option value="all">All Categories</option>' + getCategories().map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    catSel.onchange = filterAndRenderProducts;
  }
  const priceSel = document.getElementById('filterPrice');
  if (priceSel) priceSel.onchange = filterAndRenderProducts;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.oninput = filterAndRenderProducts;
  filterAndRenderProducts();
}

// --- PRODUCT DETAIL PAGE --- //
let selectedColorIndex = 0; // Track selected color index globally for the product page

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderProductDetail() {
  const id = getProductIdFromURL();
  if (!id) return;
  
  const product = getProducts().find(p => p.id === id);
  if (!product) return;
  
  // Update breadcrumb
  document.getElementById('productBreadcrumb').textContent = product.name;
  
  // Update main product info
  document.getElementById('productTitle').textContent = product.name;
  document.getElementById('productDesc').textContent = product.desc;
  document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('monthlyPayment').textContent = `or $${(product.price / 6).toFixed(2)}/month`;
  document.getElementById('productRating').textContent = '★'.repeat(Math.round(product.rating));
  document.getElementById('ratingCount').textContent = `(${product.ratingCount})`;
  document.getElementById('stockInfo').innerHTML = `<span class="stock-warning">Only ${product.stock} Items Left! Don't miss it</span>`;
  
  // Set main image
  const mainImage = document.getElementById('mainProductImage');
  mainImage.src = product.image;
  mainImage.alt = product.name;
  
  // Create thumbnail gallery
  renderThumbnailGallery(product);
  
  // Create color swatches
  renderColorSwatches(product);
  
  // Setup quantity controls
  setupQuantityControls(product);
  
  // Setup action buttons
  setupActionButtons(product);
  
  // Add smooth animations
  addProductAnimations();
}

function renderThumbnailGallery(product) {
  const thumbnailGallery = document.getElementById('thumbnailGallery');
  thumbnailGallery.innerHTML = '';
  
  product.colors.forEach((color, index) => {
    const thumbnailItem = document.createElement('div');
    thumbnailItem.className = `thumbnail-item ${index === selectedColorIndex ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.src = product.image; // In a real app, use different images per color
    img.alt = `${product.name} - Color ${index + 1}`;
    
    thumbnailItem.appendChild(img);
    thumbnailGallery.appendChild(thumbnailItem);
    
    // Add click event to change main image and color
    thumbnailItem.addEventListener('click', () => {
      selectColor(product, index);
    });
  });
}

function renderColorSwatches(product) {
  const colorSwatches = document.getElementById('colorSwatches');
  colorSwatches.innerHTML = '';
  
  product.colors.forEach((color, index) => {
    const swatch = document.createElement('div');
    swatch.className = `color-swatch ${index === selectedColorIndex ? 'active' : ''}`;
    swatch.style.backgroundColor = color;
    
    colorSwatches.appendChild(swatch);
    
    // Add click event to change color
    swatch.addEventListener('click', () => {
      selectColor(product, index);
    });
  });
}

function selectColor(product, colorIndex) {
  selectedColorIndex = colorIndex;
  // Update swatches and thumbnails
  renderColorSwatches(product);
  renderThumbnailGallery(product);
  // Update main image (simulate different image per color)
  updateMainImageForColor(product, colorIndex);
}

function updateMainImageForColor(product, colorIndex) {
  const mainImage = document.getElementById('mainProductImage');
  const thumbnailGallery = document.getElementById('thumbnailGallery');
  mainImage.style.opacity = '0';
  setTimeout(() => {
    mainImage.src = product.image; // In a real app, use product.images[colorIndex] if available
    mainImage.style.opacity = '1';
    thumbnailGallery.querySelectorAll('.thumbnail-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === colorIndex);
    });
  }, 150);
}

function setupQuantityControls(product) {
  const qtyInput = document.getElementById('quantity');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  qtyInput.max = product.stock;
  qtyMinus.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1;
      animateQuantityChange();
    }
  });
  qtyPlus.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue < product.stock) {
      qtyInput.value = currentValue + 1;
      animateQuantityChange();
    }
  });
  qtyInput.addEventListener('input', () => {
    let value = parseInt(qtyInput.value);
    if (isNaN(value) || value < 1) {
      qtyInput.value = 1;
    } else if (value > product.stock) {
      qtyInput.value = product.stock;
    }
  });
}

function setupActionButtons(product) {
  const addToCartBtn = document.getElementById('addToCartBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value);
    const color = product.colors[selectedColorIndex];
    addToCart(product.id, quantity, color);
    addToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
    addToCartBtn.style.background = '#27ae60';
    setTimeout(() => {
      addToCartBtn.innerHTML = 'Add to Cart';
      addToCartBtn.style.background = '';
    }, 2000);
  });
  buyNowBtn.addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value);
    const color = product.colors[selectedColorIndex];
    addToCart(product.id, quantity, color);
    window.location.href = 'cart.html';
  });
}

function animateQuantityChange() {
  const qtyInput = document.getElementById('quantity');
  qtyInput.style.transform = 'scale(1.1)';
  setTimeout(() => {
    qtyInput.style.transform = 'scale(1)';
  }, 150);
}

function addProductAnimations() {
  // Add entrance animations
  const elements = [
    document.getElementById('productTitle'),
    document.getElementById('productDesc'),
    document.getElementById('productRating'),
    document.getElementById('productPrice'),
    document.getElementById('colorSwatches'),
    document.getElementById('quantity'),
    document.getElementById('productActions')
  ];
  
  elements.forEach((element, index) => {
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}

// --- CART PAGE --- //
function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  if (!cartItemsDiv) return;
  const cart = getCart();
  const products = getProducts();
  cartItemsDiv.innerHTML = '';
  if (!cart.length) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    updateCartSummary();
    return;
  }
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${product.name}</div>
        <div class="cart-item-desc">${product.desc}</div>
        <div class="cart-item-color">Color: <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${item.color};border:1px solid #ccc;margin-left:4px;"></span></div>
        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-minus" data-id="${item.id}" data-color="${item.color}">-</button>
          <input type="number" min="1" max="${product.stock}" value="${item.qty}" data-id="${item.id}" data-color="${item.color}">
          <button class="qty-plus" data-id="${item.id}" data-color="${item.color}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" data-color="${item.color}"><i class="fa fa-trash"></i></button>
    `;
    cartItemsDiv.appendChild(div);
  });
  updateCartSummary();
}

function updateCartSummary() {
  const cart = getCart();
  const products = getProducts();
  let subtotal = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) subtotal += product.price * item.qty;
  });
  document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  const shipping = subtotal > 0 ? 0 : 0;
  document.getElementById('cartShipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${(subtotal + shipping).toFixed(2)}`;
}

function setupCartEvents() {
  const cartItemsDiv = document.getElementById('cartItems');
  if (!cartItemsDiv) return;
  cartItemsDiv.onclick = (e) => {
    const id = e.target.dataset.id;
    const color = e.target.dataset.color;
    if (!id || !color) return;
    if (e.target.classList.contains('cart-item-remove')) {
      removeFromCart(id, color);
    } else if (e.target.classList.contains('qty-minus')) {
      updateCartQty(id, color, -1);
    } else if (e.target.classList.contains('qty-plus')) {
      updateCartQty(id, color, 1);
    }
  };
  cartItemsDiv.oninput = (e) => {
    if (e.target.type === 'number' && e.target.dataset.id && e.target.dataset.color) {
      const id = e.target.dataset.id;
      const color = e.target.dataset.color;
      const val = parseInt(e.target.value);
      if (val > 0) setCartQty(id, color, val);
    }
  };
}

function addToCart(id, qty, color) {
  let cart = getCart();
  // Find if same product+color already in cart
  const idx = cart.findIndex(item => item.id === id && item.color === color);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id, qty, color });
  }
  setCart(cart);
  updateCartCount();
  alert('Added to cart!');
}
function removeFromCart(id, color) {
  let cart = getCart().filter(item => !(item.id === id && item.color === color));
  setCart(cart);
  renderCart();
  updateCartCount();
}
function updateCartQty(id, color, delta) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === id && item.color === color);
  if (idx > -1) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    setCart(cart);
    renderCart();
    updateCartCount();
  }
}
function setCartQty(id, color, qty) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === id && item.color === color);
  if (idx > -1) {
    cart[idx].qty = qty;
    setCart(cart);
    renderCart();
    updateCartCount();
  }
}

// --- CHECKOUT (Cart Page) --- //
function setupCheckout() {
  const btn = document.getElementById('checkoutBtn');
  if (!btn) return;
  btn.onclick = () => {
    // Show simple prompt for checkout info
    const name = prompt('Enter your name:');
    const email = prompt('Enter your email:');
    const address = prompt('Enter your address:');
    if (!validateCheckout(name, email, address)) {
      alert('Please enter valid name, email, and address.');
      return;
    }
    // Save order
    const cart = getCart();
    if (!cart.length) return;
    const products = getProducts();
    const order = {
      id: 'o' + Date.now(),
      items: cart,
      name,
      email,
      address,
      status: 'Confirmed',
      date: new Date().toLocaleString()
    };
    const orders = getOrders();
    orders.push(order);
    setOrders(orders);
    setCart([]);
    updateCartCount();
    alert('Order placed successfully!');
    window.location.href = 'orders.html';
  };
}
function validateCheckout(name, email, address) {
  if (!name || !email || !address) return false;
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(email);
}

// --- MY ORDERS PAGE --- //
function renderOrders() {
  const ordersList = document.getElementById('ordersList');
  if (!ordersList) return;
  const orders = getOrders();
  if (!orders.length) {
    ordersList.innerHTML = '<p>No orders found.</p>';
    return;
  }
  ordersList.innerHTML = '';
  orders.slice().reverse().forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-card';
    div.innerHTML = `
      <div class="order-card-header">
        <div class="order-card-title">Order #${order.id}</div>
        <div class="order-card-status ${order.status.toLowerCase()}">${order.status}</div>
      </div>
      <div class="order-card-details">
        <div><b>Date:</b> ${order.date}</div>
        <div><b>Name:</b> ${order.name}</div>
        <div><b>Email:</b> ${order.email}</div>
        <div><b>Address:</b> ${order.address}</div>
        <div><b>Items:</b> ${order.items.map(item => {
          const p = getProducts().find(prod => prod.id === item.id);
          return p ? `${p.name} (x${item.qty})` : '';
        }).join(', ')}</div>
      </div>
    `;
    ordersList.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("adminProductForm");
  const addProductBtn = document.getElementById("addProductBtn");
  const colorPicker = document.getElementById("colorPicker");
  const addColorBtn = document.getElementById("addColorBtn");
  const colorPickerList = document.getElementById("colorPickerList");
  const imageUploadList = document.getElementById("imageUploadList");
  const imageUploadArea = document.getElementById("imageUploadArea");
  
  const adminProductId = document.getElementById("adminProductId");
  const adminProductName = document.getElementById("adminProductName");
  const adminProductDesc = document.getElementById("adminProductDesc");
  const adminProductBrand = document.getElementById("adminProductBrand");
  const adminProductSize = document.getElementById("adminProductSize");
  const adminProductPrice = document.getElementById("adminProductPrice");
  const adminProductComparePrice = document.getElementById("adminProductComparePrice");
  const adminProductDiscount = document.getElementById("adminProductDiscount");
  const adminProductMinOrder = document.getElementById("adminProductMinOrder");
  const adminProductCategory = document.getElementById("adminProductCategory");
  const adminProductSubCategory = document.getElementById("adminProductSubCategory");
  const adminProductSKU = document.getElementById("adminProductSKU");
  const adminProductStock = document.getElementById("adminProductStock");
  const adminProductMinStock = document.getElementById("adminProductMinStock");

  const productListContainer = document.createElement("div");
  productListContainer.className = "admin-product-list";
  document.querySelector(".admin-main").appendChild(productListContainer);

  let colors = [];
  let imageURLs = [];

  /** Load Products */
  function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  /** Render Products in Admin List */
  function renderProductList() {
    const products = getProducts();
    productListContainer.innerHTML = `
      <h2 style="margin:20px 0;">All Products</h2>
      ${products.length === 0 ? "<p>No products added yet.</p>" : ""}
    `;
    products.forEach((p, index) => {
      const item = document.createElement("div");
      item.className = "admin-product-item";
      item.style = `
        display:flex; justify-content:space-between; align-items:center;
        background:#fff; padding:10px; border:1px solid #ddd; margin-bottom:10px;
      `;
      item.innerHTML = `
        <div>
          <strong>${p.name}</strong> - $${p.price} | Stock: ${p.stock}
        </div>
        <div>
          <button data-index="${index}" class="edit-btn">Edit</button>
          <button data-index="${index}" class="delete-btn">Delete</button>
        </div>
      `;
      productListContainer.appendChild(item);
    });

    // Attach events
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => editProduct(btn.dataset.index));
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteProduct(btn.dataset.index));
    });
  }

  /** Add Color */
  addColorBtn.addEventListener("click", () => {
    colorPicker.click();
  });

  colorPicker.addEventListener("input", (e) => {
    if (colors.length >= 6) return alert("Max 6 colors allowed");
    const color = e.target.value;
    colors.push(color);
    updateColorUI();
  });

  function updateColorUI() {
    colorPickerList.innerHTML = "";
    colors.forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "color-swatch";
      div.style.background = c;
      const removeBtn = document.createElement("div");
      removeBtn.className = "color-swatch-remove";
      removeBtn.innerHTML = "&times;";
      removeBtn.addEventListener("click", () => {
        colors.splice(i, 1);
        updateColorUI();
      });
      div.appendChild(removeBtn);
      colorPickerList.appendChild(div);
    });
  }

  /** Handle Image URLs (Max 4) */
  imageUploadArea.addEventListener("click", () => {
    const url = prompt("Enter image URL:");
    if (url && imageURLs.length < 4) {
      imageURLs.push(url);
      updateImageUI();
    } else if (imageURLs.length >= 4) {
      alert("Max 4 images allowed");
    }
  });

  function updateImageUI() {
    imageUploadList.innerHTML = "";
    imageURLs.forEach((img, i) => {
      const div = document.createElement("div");
      div.className = "image-thumb";
      div.style.backgroundImage = `url(${img})`;
      const removeBtn = document.createElement("div");
      removeBtn.className = "image-thumb-remove";
      removeBtn.innerHTML = "&times;";
      removeBtn.addEventListener("click", () => {
        imageURLs.splice(i, 1);
        updateImageUI();
      });
      div.appendChild(removeBtn);
      imageUploadList.appendChild(div);
    });
  }

  /** Add / Update Product */
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const products = getProducts();
    const productData = {
      id: adminProductId.value || Date.now().toString(),
      name: adminProductName.value,
      description: adminProductDesc.value,
      brand: adminProductBrand.value,
      size: adminProductSize.value,
      colors: colors,
      price: parseFloat(adminProductPrice.value),
      comparePrice: parseFloat(adminProductComparePrice.value) || 0,
      discount: parseFloat(adminProductDiscount.value) || 0,
      minOrder: parseInt(adminProductMinOrder.value) || 1,
      category: adminProductCategory.value,
      subCategory: adminProductSubCategory.value,
      sku: adminProductSKU.value,
      stock: parseInt(adminProductStock.value),
      minStock: parseInt(adminProductMinStock.value) || 0,
      images: imageURLs
    };

    if (adminProductId.value) {
      const index = products.findIndex(p => p.id === adminProductId.value);
      products[index] = productData;
    } else {
      products.push(productData);
    }

    saveProducts(products);
    resetForm();
    renderProductList();
    window.location.href = "index.html"; // Redirect to home page after adding product
  });

  /** Edit Product */
  function editProduct(index) {
    const products = getProducts();
    const p = products[index];
    adminProductId.value = p.id;
    adminProductName.value = p.name;
    adminProductDesc.value = p.description;
    adminProductBrand.value = p.brand;
    adminProductSize.value = p.size;
    adminProductPrice.value = p.price;
    adminProductComparePrice.value = p.comparePrice;
    adminProductDiscount.value = p.discount;
    adminProductMinOrder.value = p.minOrder;
    adminProductCategory.value = p.category;
    adminProductSubCategory.value = p.subCategory;
    adminProductSKU.value = p.sku;
    adminProductStock.value = p.stock;
    adminProductMinStock.value = p.minStock;
    colors = [...p.colors];
    imageURLs = [...p.images];
    updateColorUI();
    updateImageUI();
  }

  /** Delete Product */
  function deleteProduct(index) {
    const products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
    renderProductList();
  }

  function resetForm() {
    productForm.reset();
    adminProductId.value = "";
    colors = [];
    imageURLs = [];
    updateColorUI();
    updateImageUI();
  }

  renderProductList();
});


// --- PAGE INITIALIZATION --- //
document.addEventListener('DOMContentLoaded', () => {
  // Always update cart count and setup nav
  updateCartCount();
  setupNavbar();

  // Page-specific logic
  if (document.body.contains(document.getElementById('productGrid'))) {
    setupHomepage();
  }
  if (document.body.contains(document.getElementById('mainProductImage'))) {
    renderProductDetail();
  }
  if (document.body.contains(document.getElementById('cartItems'))) {
    renderCart();
    setupCartEvents();
    setupCheckout();
  }
  if (document.body.contains(document.getElementById('ordersList'))) {
    renderOrders();
  }
  if (document.body.contains(document.getElementById('adminProductList'))) {
    renderAdminProducts();
    setupAdminProductForm();
    setupAdminProductActions();
    renderAdminOrders();
    setupAdminOrderActions();
  }
}); 

// --- Admin Panel Modular JS --- //

/* --- Data Helpers --- */
function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}
function setProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

/* --- Modal Logic --- */
function openModal(id) {
  const overlay = document.getElementById(id);
  overlay.style.display = 'flex';
  setTimeout(() => overlay.classList.add('show'), 10);
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.remove('show');
  setTimeout(() => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }, 200);
}

/* --- Product Modal State --- */
let modalImages = [];
let modalColors = [];
let editingProductId = null;

/* --- Image Upload --- */
function setupImageUpload() {
  const uploadBtn = document.getElementById('uploadImagesBtn');
  const fileInput = document.getElementById('adminProductImages');
  const imageList = document.getElementById('imageUploadList');
  uploadBtn.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        modalImages.push(ev.target.result);
        renderImageThumbs();
      };
      reader.readAsDataURL(file);
    });
    fileInput.value = '';
  };
  imageList.onclick = (e) => {
    if (e.target.classList.contains('image-thumb-remove')) {
      const idx = parseInt(e.target.dataset.idx);
      modalImages.splice(idx, 1);
      renderImageThumbs();
    }
  };
}
function renderImageThumbs() {
  const imageList = document.getElementById('imageUploadList');
  imageList.innerHTML = '';
  modalImages.forEach((src, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'image-thumb';
    thumb.style.backgroundImage = `url('${src}')`;
    thumb.innerHTML = `<span class="image-thumb-remove" data-idx="${idx}">&times;</span>`;
    imageList.appendChild(thumb);
  });
}

/* --- Color Picker --- */
function setupColorPicker() {
  const addColorBtn = document.getElementById('addColorBtn');
  const colorInput = document.getElementById('colorPicker');
  const colorList = document.getElementById('colorPickerList');
  addColorBtn.onclick = () => colorInput.click();
  colorInput.oninput = (e) => {
    modalColors.push(e.target.value);
    renderColorSwatches();
  };
  colorList.onclick = (e) => {
    if (e.target.classList.contains('color-swatch-remove')) {
      const idx = parseInt(e.target.dataset.idx);
      modalColors.splice(idx, 1);
      renderColorSwatches();
    }
  };
}
function renderColorSwatches() {
  const colorList = document.getElementById('colorPickerList');
  colorList.innerHTML = '';
  modalColors.forEach((color, idx) => {
    const swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.background = color;
    swatch.innerHTML = `<span class="color-swatch-remove" data-idx="${idx}">&times;</span>`;
    colorList.appendChild(swatch);
  });
}

/* --- Product Table Rendering --- */
function renderProductTable() {
  const tbody = document.querySelector('#adminProductTable tbody');
  const products = getProducts();
  tbody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        ${(product.images || [product.image]).map(img => `<img src="${img}" style="width:36px;height:36px;border-radius:8px;margin-right:2px;">`).join('')}
      </td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>
        ${(product.colors || []).map(c => `<span class="color-swatch" style="background:${c};width:18px;height:18px;display:inline-block;margin-right:2px;"></span>`).join('')}
      </td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn-outline edit-product" data-id="${product.id}"><i class="fa fa-edit"></i></button>
        <button class="btn-outline delete-product" data-id="${product.id}"><i class="fa fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* --- Add/Edit Product Modal Logic --- */
function openProductModal(editId = null) {
  editingProductId = editId;
  const form = document.getElementById('adminProductForm');
  form.reset();
  modalImages = [];
  modalColors = [];
  if (editId) {
    document.getElementById('modalTitle').textContent = 'Edit Product';
    const product = getProducts().find(p => p.id === editId);
    if (product) {
      document.getElementById('adminProductId').value = product.id;
      document.getElementById('adminProductName').value = product.name;
      document.getElementById('adminProductDesc').value = product.desc;
      document.getElementById('adminProductCategory').value = product.category;
      document.getElementById('adminProductPrice').value = product.price;
      document.getElementById('adminProductStock').value = product.stock;
      document.getElementById('adminProductDeal').value = product.deal || '';
      modalImages = product.images ? product.images.slice() : (product.image ? [product.image] : []);
      modalColors = product.colors ? product.colors.slice() : [];
    }
  } else {
    document.getElementById('modalTitle').textContent = 'Add Product';
  }
  renderImageThumbs();
  renderColorSwatches();
  openModal('productModalOverlay');
}

/* --- Save Product (Add/Edit) --- */
function setupProductForm() {
  const form = document.getElementById('adminProductForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('adminProductId').value || 'p' + Date.now();
    const name = document.getElementById('adminProductName').value.trim();
    const desc = document.getElementById('adminProductDesc').value.trim();
    const category = document.getElementById('adminProductCategory').value;
    const price = parseFloat(document.getElementById('adminProductPrice').value);
    const stock = parseInt(document.getElementById('adminProductStock').value);
    const deal = document.getElementById('adminProductDeal').value.trim();
    if (!name || !desc || !category || isNaN(price) || isNaN(stock) || modalImages.length === 0) {
      alert('Please fill all fields and upload at least one image.');
      return;
    }
    let products = getProducts();
    const productData = {
      id, name, desc, category, price, stock, deal,
      images: modalImages.slice(),
      colors: modalColors.slice(),
      rating: 4.5, ratingCount: 0
    };
    if (editingProductId) {
      products = products.map(p => p.id === id ? productData : p);
    } else {
      products.push(productData);
    }
    setProducts(products);
    renderProductTable();
    closeModal('productModalOverlay');
  };
  document.getElementById('cancelProductBtn').onclick = () => closeModal('productModalOverlay');
  document.getElementById('productModalOverlay').onclick = (e) => {
    if (e.target === document.getElementById('productModalOverlay')) closeModal('productModalOverlay');
  };
}

/* --- Product Table Actions (Edit/Delete) --- */
function setupProductTableActions() {
  const tbody = document.querySelector('#adminProductTable tbody');
  tbody.onclick = (e) => {
    const id = e.target.closest('button')?.dataset.id;
    if (!id) return;
    if (e.target.closest('.edit-product')) {
      openProductModal(id);
    } else if (e.target.closest('.delete-product')) {
      if (confirm('Delete this product?')) {
        let products = getProducts().filter(p => p.id !== id);
        setProducts(products);
        renderProductTable();
      }
    }
  };
}

/* --- Sidebar Tabs --- */
function setupSidebarTabs() {
  const tabs = [
    { btn: 'sidebarProducts', section: 'admin-products' },
    { btn: 'sidebarOrders', section: 'admin-orders' },
    { btn: 'sidebarUsers', section: 'admin-users' },
    { btn: 'sidebarSettings', section: 'admin-settings' }
  ];
  tabs.forEach(({ btn, section }) => {
    const btnEl = document.getElementById(btn);
    if (btnEl) {
      btnEl.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
        btnEl.classList.add('active');
        document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
        document.getElementById(section).style.display = '';
      };
    }
  });
}

/* --- Initialize Admin Panel --- */
function initAdminPanel() {
  renderProductTable();
  setupImageUpload();
  setupColorPicker();
  setupProductForm();
  setupProductTableActions();
  setupSidebarTabs();
  document.getElementById('addProductBtn').onclick = () => openProductModal();
}

if (window.location.pathname.endsWith('admin.html')) {
  document.addEventListener('DOMContentLoaded', initAdminPanel);
}

// Initialize product detail page
if (window.location.pathname.endsWith('product.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    updateCartCount();
    renderProductDetail();
  });
}

// Initialize cart page
if (window.location.pathname.endsWith('cart.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    updateCartCount();
    renderCart();
    setupCartEvents();
    setupCheckout();
  });
}

// Initialize orders page
if (window.location.pathname.endsWith('orders.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    updateCartCount();
    renderOrders();
  });
}

// Initialize homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
  document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    updateCartCount();
    setupHomepage();
  });
} 