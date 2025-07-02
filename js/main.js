// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  initMobileMenu();

  // Load products on homepage
  loadHomepageProducts();

  // Initialize search functionality
  initSearch();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize newsletter form
  initNewsletter();

  // Initialize lazy loading for images
  initLazyLoading();

  // Initialize wishlist button
  initWishlistButton();

  // Initialize user button
  initUserButton();

  // Initialize price range filter
  initPriceRangeFilter();

  // Load products based on current page
  const currentPage = window.location.pathname.split('/').pop();
  switch (currentPage) {
    case 'index.html':
      loadHomepageProducts();
      break;
    case 'women.html':
      loadCategoryProducts('women');
      break;
    case 'men.html':
      loadCategoryProducts('men');
      break;
    case 'accessories.html':
      loadCategoryProducts('accessories');
      break;
    case 'sale.html':
      loadSaleProducts();
      break;
  }

  // Update prices after products are rendered
  updateAllPrices();
});

// Currency conversion utility
const USD_TO_IDR_RATE = 15000; // Approximate conversion rate

function formatPrice(price, isOriginal = false) {
  const idrPrice = price * USD_TO_IDR_RATE;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(idrPrice);
}

// Price range filter
function initPriceRangeFilter() {
  const priceSlider = document.getElementById('priceSlider');
  const priceRange = document.getElementById('priceRange');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');

  if (!priceSlider || !priceRange || !minPrice || !maxPrice) return;

  priceSlider.noUiSlider = noUiSlider.create(priceSlider, {
    start: [0, 1000],
    connect: true,
    range: {
      'min': 0,
      'max': 1000
    }
  });

  // Update price range display
  priceSlider.noUiSlider.on('update', function (values) {
    const min = parseFloat(values[0]);
    const max = parseFloat(values[1]);
    priceRange.textContent = `Price: ${formatPrice(min)} - ${formatPrice(max)}`;
    minPrice.value = min;
    maxPrice.value = max;
  });

  // Update slider when input values change
  minPrice.addEventListener('change', function () {
    priceSlider.noUiSlider.set([this.value, null]);
  });

  maxPrice.addEventListener('change', function () {
    priceSlider.noUiSlider.set([null, this.value]);
  });
}

function updateAllPrices() {
  // Update product prices
  const priceElements = document.querySelectorAll('.price, .original-price');
  priceElements.forEach(element => {
    const usdPrice = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
    if (!isNaN(usdPrice)) {
      const isOriginal = element.classList.contains('original-price');
      element.textContent = formatPrice(usdPrice, isOriginal);
    }
  });

  // Update price range
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    const min = parseFloat(priceRange.getAttribute('data-min')) || 0;
    const max = parseFloat(priceRange.getAttribute('data-max')) || 1000;
    priceRange.textContent = `Price: ${formatPrice(min)} - ${formatPrice(max)}`;
  }

  // Update cart total
  const cartTotalElement = document.getElementById('cartTotal');
  if (cartTotalElement) {
    const usdTotal = parseFloat(cartTotalElement.textContent.replace(/[^\d.]/g, ''));
    if (!isNaN(usdTotal)) {
      cartTotalElement.textContent = `Total: ${formatPrice(usdTotal)}`;
    }
  }
}

// Product rendering functions
function loadHomepageProducts() {
  const productsContainer = document.getElementById('products');
  if (!productsContainer) return;

  // Get featured products and sort by price descending
  const featuredProducts = products
    .filter(product => product.featured)
    .sort((a, b) => b.price - a.price);
  
  renderProducts(featuredProducts, productsContainer);
}

function loadCategoryProducts(category) {
  const productsContainer = document.getElementById('products');
  if (!productsContainer) return;

  // Get products for the current category and sort by name
  const categoryProducts = products
    .filter(product => product.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  renderProducts(categoryProducts, productsContainer);
}

function loadSaleProducts() {
  const productsContainer = document.getElementById('products');
  if (!productsContainer) return;

  // Get products on sale and sort by discount percentage
  const saleProducts = products
    .filter(product => product.sale)
    .sort((a, b) => {
      const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
      const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
      return discountB - discountA;
    });
  
  renderProducts(saleProducts, productsContainer);
}

function renderProducts(products, container) {
  container.innerHTML = '';
  
  products.forEach(product => {
    const productHtml = `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.sale ? '<span class="sale-badge">Sale</span>' : ''}
          ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          ${product.originalPrice ? `
            <p class="original-price">${formatPrice(product.originalPrice, true)}</p>
            <p class="price">${formatPrice(product.price)}</p>
          ` : `
            <p class="price">${formatPrice(product.price)}</p>
          `}
          <div class="product-actions">
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
              Add to Cart
            </button>
            <button class="btn btn-secondary" onclick="quickAddToCart('${product.id}')">
              Quick Add
            </button>
            <button class="btn btn-wishlist" onclick="toggleWishlist('${product.id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += productHtml;
  });

  // Add event listeners for wishlist buttons
  const wishlistButtons = container.querySelectorAll('.btn-wishlist');
  wishlistButtons.forEach(button => {
    const productId = button.closest('.product-card').dataset.productId;
    button.addEventListener('click', () => toggleWishlist(productId));
  });

  // Dispatch event after products are rendered
  const event = new Event('productsRendered');
  document.dispatchEvent(event);

  // Update prices immediately after rendering
  updateAllPrices();
}

// Update prices after products are rendered
document.addEventListener('productsRendered', function() {
  updateAllPrices();
});

// Add to cart functionality
function quickAddToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.addItem(product);
  }
}

// Mobile Menu
function initMobileMenu() {
  // Initialize mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  // Initialize navigation link active states
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove("active"));
      // Add active class to clicked link
      this.classList.add("active");
    });
  });

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileNav.classList.toggle("active");

      // Update button icon
      const icon = mobileMenuBtn.querySelector("svg");
      if (mobileNav.classList.contains("active")) {
        icon.innerHTML =
          '<line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line>';
      } else {
        icon.innerHTML =
          '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>';
      }
    });

    // Close mobile menu when clicking on links
    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("svg");
        icon.innerHTML =
          '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>';
      });
    });
  }
}

// Load products on homepage
function loadHomepageProducts() {
  const featuredContainer = document.getElementById("featuredProducts");
  const saleContainer = document.getElementById("saleProducts");

  if (featuredContainer) {
    const featuredProducts = getFeaturedProducts();
    featuredContainer.innerHTML = featuredProducts
      .slice(0, 4)
      .map((product) => createProductCard(product))
      .join("");
  }

  if (saleContainer) {
    const saleProducts = getSaleProducts();
    saleContainer.innerHTML = saleProducts
      .slice(0, 4)
      .map((product) => createSaleProductCard(product))
      .join("");
  }
}

// Create product card HTML
function createProductCard(product) {
  const discount = calculateDiscount(product);
  const stars = generateStars(product.rating || 0);

  return `
        <div class="product-card animate-fade-in">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badges">
                    ${product.sale ? `<span class="product-badge badge-sale">${discount}% OFF</span>` : ""}
                    ${product.featured ? '<span class="product-badge badge-featured">Featured</span>' : ""}
                </div>
                <div class="product-actions">
                    <button class="icon-btn" onclick="toggleWishlist('${product.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                ${
                  product.rating
                    ? `
                    <div class="product-rating">
                        <span class="stars-small">${stars}</span>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                `
                    : ""
                }
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ""}
                </div>
                <button class="btn btn-primary add-to-cart-btn" 
                        data-product-id="${product.id}" 
                        style="width: 100%; margin-top: 1rem;">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Create sale product card (simplified version)
function createSaleProductCard(product) {
  const discount = calculateDiscount(product);

  return `
        <div class="card animate-fade-in">
            <div style="position: relative; overflow: hidden; border-radius: 0.5rem 0.5rem 0 0;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 16rem; object-fit: cover;" loading="lazy">
                <div style="position: absolute; top: 0.75rem; left: 0.75rem;">
                    <span style="background-color: var(--red-500); color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;">
                        ${discount || 30}% OFF
                    </span>
                </div>
            </div>
            <div style="padding: 1.5rem;">
                <h3 style="font-weight: 600; color: var(--amber-900); margin-bottom: 0.5rem;">${product.name}</h3>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem; font-weight: 700; color: var(--amber-900);">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span style="color: var(--gray-500); text-decoration: line-through;">${formatPrice(product.originalPrice)}</span>` : ""}
                </div>
            </div>
        </div>
    `;
}

// Search functionality
function initSearch() {
  const searchBtnHeader = document.querySelector(".header-actions .search-btn"); // More specific selector
  const searchModal = document.getElementById("searchModal");
  const closeSearchModalBtn = document.getElementById("closeSearchModal");
  const searchInput = document.getElementById("searchInput");
  const searchResultsContainer = document.getElementById("searchResultsContainer");

  if (searchBtnHeader && searchModal && closeSearchModalBtn && searchInput && searchResultsContainer) {
    searchBtnHeader.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent any default button action
      searchModal.classList.add("active");
      searchInput.focus(); // Focus the input field when modal opens
    });

    closeSearchModalBtn.addEventListener("click", function () {
      searchModal.classList.remove("active");
      searchInput.value = ""; // Clear search input
      searchResultsContainer.innerHTML = ""; // Clear results
    });

    // Close modal if clicked outside of modal-content
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) {
        searchModal.classList.remove("active");
        searchInput.value = "";
        searchResultsContainer.innerHTML = "";
      }
    });

    searchInput.addEventListener("input", function () {
      const query = this.value.trim();
      performSearch(query, searchResultsContainer);
    });
  }
}

function performSearch(query, container) {
  container.innerHTML = ""; // Clear previous results

  if (query.length < 2) { // Optional: only search if query is at least 2 chars
    if (query.length > 0) {
        // container.innerHTML = '<p class="search-feedback">Keep typing to see results...</p>';
    }
    return;
  }

  const results = searchProducts(query); // Assumes searchProducts is globally available from products.js

  if (results.length > 0) {
    results.forEach(product => {
      const productElement = document.createElement("a");
      productElement.href = `product.html?id=${product.id}`; // Assuming a product detail page
      productElement.classList.add("search-result-item");
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="search-result-image">
        <div class="search-result-info">
          <h4>${product.name}</h4>
          <p>${formatPrice(product.price)}</p>
        </div>
      `;
      container.appendChild(productElement);
    });
  } else {
    container.innerHTML = '<p class="search-feedback">No products found matching your search.</p>';
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Newsletter form
function initNewsletter() {
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    const input = newsletterForm.querySelector(".newsletter-input");
    const button = newsletterForm.querySelector(".btn-newsletter");

    if (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const email = input.value.trim();

        if (email && isValidEmail(email)) {
          // Simulate subscription
          showNotification("Thank you for subscribing!", "success");
          input.value = "";
        } else {
          showNotification("Please enter a valid email address.", "error");
        }
      });
    }
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show notification using CSS classes
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  // Map 'error' type to 'danger' class for CSS consistency
  const alertTypeClass = type === "error" ? "alert-danger" : `alert-${type}`;
  notification.className = `alert ${alertTypeClass}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Trigger the slide-in animation
  // Using requestAnimationFrame ensures the initial state is rendered before transition starts
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // Duration the notification is visible
  const visibilityDuration = 3000; // 3 seconds
  // Transition duration should match CSS (0.3s = 300ms)
  const transitionDuration = 300;

  // Set timeout to hide the notification
  setTimeout(() => {
    notification.classList.remove("show");
    // Set timeout to remove the element from DOM after hide animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, transitionDuration);
  }, visibilityDuration);
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Initialize user button
function initUserButton() {
  const userBtn = document.getElementById("userBtn");
  const userModal = document.getElementById("userModal");
  const closeUserModalBtn = document.getElementById("closeUserModal");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginContent = document.getElementById("loginContent");
  const signupContent = document.getElementById("signupContent");

  if (userBtn && userModal && closeUserModalBtn) {
    // Open user modal
    userBtn.addEventListener("click", function (e) {
      e.preventDefault();
      userModal.classList.add("active");
    });

    // Close user modal
    closeUserModalBtn.addEventListener("click", function () {
      userModal.classList.remove("active");
    });

    // Close modal when clicking outside
    userModal.addEventListener("click", function (e) {
      if (e.target === userModal) {
        userModal.classList.remove("active");
      }
    });

    // Tab switching
    if (loginTab && signupTab) {
      loginTab.addEventListener("click", function () {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginContent.classList.remove("hidden");
        signupContent.classList.add("hidden");
      });

      signupTab.addEventListener("click", function () {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        signupContent.classList.remove("hidden");
        loginContent.classList.add("hidden");
      });
    }

    // Form submissions
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = this.querySelector("#loginEmail").value;
        const password = this.querySelector("#loginPassword").value;

        // Here you would typically make an API call to your backend
        // For now, we'll simulate a successful login
        showNotification("Login successful!", "success");
        userModal.classList.remove("active");
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = this.querySelector("#signupEmail").value;
        const password = this.querySelector("#signupPassword").value;
        const confirmPassword = this.querySelector("#confirmPassword").value;

        // Basic validation
        if (password !== confirmPassword) {
          showNotification("Passwords do not match.", "error");
          return;
        }

        // Here you would typically make an API call to your backend
        // For now, we'll simulate a successful signup
        showNotification("Account created successfully!", "success");
        userModal.classList.remove("active");
      });
    }
  }
}

// Wishlist button
function initWishlistButton() {
  const wishlistBtnHeader = document.getElementById("wishlistBtn");
  const wishlistModal = document.getElementById("wishlistModal");
  const closeWishlistModalBtn = document.getElementById("closeWishlistModal");

  if (wishlistBtnHeader && wishlistModal && closeWishlistModalBtn) {
    wishlistBtnHeader.addEventListener("click", function (e) {
      e.preventDefault();
      wishlistModal.classList.add("active");
      renderWishlistItems(); // Load/refresh wishlist items when modal opens
    });

    closeWishlistModalBtn.addEventListener("click", function () {
      wishlistModal.classList.remove("active");
    });

    // Close modal if clicked outside of modal-content
    wishlistModal.addEventListener("click", function (e) {
      if (e.target === wishlistModal) {
        wishlistModal.classList.remove("active");
      }
    });
  }
}

// Wishlist Storage Helper Functions
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlistItems')) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
}

// Add/Remove item from wishlist (called from product cards)
function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const product = getProductById(productId); // From products.js
  const productIndex = wishlist.indexOf(productId);

  if (!product) {
    console.error("Product not found:", productId);
    showNotification("Error: Product not found.", "error");
    return;
  }

  if (productIndex > -1) {
    // Product is in wishlist, remove it
    wishlist.splice(productIndex, 1);
    showNotification(`${product.name} removed from wishlist.`, "info");
  } else {
    // Product is not in wishlist, add it
    wishlist.push(productId);
    showNotification(`${product.name} added to wishlist!`, "success");
  }
  saveWishlist(wishlist);

  // If wishlist modal is open, refresh its content
  const wishlistModal = document.getElementById("wishlistModal");
  if (wishlistModal && wishlistModal.classList.contains("active")) {
    renderWishlistItems();
  }
  
  // TODO: Update heart icon on the product card itself
}

function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  const product = getProductById(productId);
  const productIndex = wishlist.indexOf(productId);

  if (productIndex > -1) {
    wishlist.splice(productIndex, 1);
    saveWishlist(wishlist);
    if (product) {
      showNotification(`${product.name} removed from wishlist.`, "info");
    } else {
      showNotification("Item removed from wishlist.", "info");
    }
    renderWishlistItems(); // Re-render the wishlist modal
  } else {
    console.warn("Attempted to remove product not in wishlist:", productId);
  }
}

function renderWishlistItems() {
  const wishlist = getWishlist();
  const container = document.getElementById("wishlistItemsContainer");
  const emptyMessage = container ? container.querySelector(".empty-wishlist-message") : null;

  if (!container) {
    console.error("Wishlist container not found.");
    return;
  }

  container.innerHTML = ''; // Clear previous items, but preserve empty message if it's part of the container's static HTML
  // Re-add empty message if it was cleared and needed
  if (!container.querySelector(".empty-wishlist-message")) {
      const p = document.createElement('p');
      p.className = 'empty-wishlist-message';
      p.style.textAlign = 'center';
      p.style.padding = '20px';
      p.textContent = 'Your wishlist is currently empty.';
      container.appendChild(p);
      // update reference
      const newEmptyMessage = container.querySelector(".empty-wishlist-message");
      if (newEmptyMessage) newEmptyMessage.style.display = 'none'; // hide by default
  }
  const currentEmptyMessage = container.querySelector(".empty-wishlist-message");


  if (wishlist.length === 0) {
    if (currentEmptyMessage) currentEmptyMessage.style.display = 'block';
  } else {
    if (currentEmptyMessage) currentEmptyMessage.style.display = 'none';
    wishlist.forEach(productId => {
      const product = getProductById(productId); // From products.js
      if (product) {
        const itemElement = document.createElement('div');
        itemElement.className = 'wishlist-item'; // Add a class for styling
        itemElement.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
          <div class="wishlist-item-info">
            <h4>${product.name}</h4>
            <p>${formatPrice(product.price)}</p>  <!-- Ensure formatPrice is available -->
          </div>
          <button class="btn-remove-wishlist" data-product-id="${product.id}">&times;</button>
        `;
        container.appendChild(itemElement);

        const removeButton = itemElement.querySelector('.btn-remove-wishlist');
        if (removeButton) {
          removeButton.addEventListener('click', function() {
            removeFromWishlist(product.id);
          });
        }
      }
    });
  }
}

// Utility function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Utility function to update URL without page reload
function updateUrl(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url);
}

// Handle window resize
window.addEventListener("resize", function () {
  // Close mobile menu on resize to larger screen
  if (window.innerWidth >= 768) {
    const mobileNav = document.getElementById("mobileNav");
    if (mobileNav) {
      mobileNav.classList.remove("active");
    }
  }
});

// Handle scroll events
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Add/remove shadow based on scroll position
  if (scrollTop > 0) {
    header.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
  } else {
    header.style.boxShadow = "none";
  }

  lastScrollTop = scrollTop;
});
