// Shopping Cart Functionality
class ShoppingCart {
  constructor() {
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // Ensure all item IDs are strings for consistency, converting old numeric IDs
    this.items = storedCart.map(item => ({
      ...item,
      id: String(item.id) // Convert ID to string if it's not already
    }));
    this.saveCart(); // Important: Re-save the cart with string IDs to fix localStorage
    this.updateCartDisplay();
  }

  addItem(product, quantity = 1, size = null, color = null) {
    const existingItemIndex = this.items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.size === size &&
        item.color === color,
    );

    if (existingItemIndex > -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({
        product,
        quantity,
        size,
        color,
        id: (Date.now() + Math.random()).toString(), // Unique ID for cart item, stored as string
      });
    }

    this.saveCart();
    this.updateCartDisplay();
    this.showAddToCartNotification(product.name);
  }

  removeItem(itemId) {
    console.log(`[Cart Debug] Attempting to remove item. Received ID: '${itemId}', Type: ${typeof itemId}`);
    const initialItemCount = this.items.length;
    this.items = this.items.filter((item) => {
      // console.log(`[Cart Debug] Comparing with item in cart. Item ID: '${item.id}', Type: ${typeof item.id}. Match: ${item.id === itemId}`);
      return item.id !== itemId; // item.id should now always be a string
    });
    if (this.items.length < initialItemCount) {
      console.log(`[Cart Debug] Item with ID '${itemId}' successfully removed.`);
    } else {
      console.log(`[Cart Debug] Item with ID '${itemId}' NOT found or not removed. Current items (IDs only):`, JSON.parse(JSON.stringify(this.items.map(i => i.id)) ) );
    }
    this.saveCart();
    this.updateCartDisplay();
  }

  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.items.find((item) => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.updateCartDisplay();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  updateCartDisplay() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? "flex" : "none";
    }

    // Update cart modal if it exists
    this.updateCartModal();
  }

  updateCartModal() {
    const cartModal = document.getElementById("cartModal");
    if (!cartModal) return;

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    if (this.items.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty</p>";
      cartTotal.textContent = "Total: " + formatPrice(0);
      return;
    }

    cartItems.innerHTML = this.items
      .map(
        (item) => `
            <div class="cart-item" style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--gray-200);">
                <img src="${item.product.image}" alt="${item.product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.375rem;">
                <div style="flex: 1;">
                    <h4 style="font-weight: 600; color: var(--amber-900); margin-bottom: 0.25rem;">${item.product.name}</h4>
                    ${item.size ? `<p style="font-size: 0.875rem; color: var(--amber-700);">Size: ${item.size}</p>` : ""}
                    ${item.color ? `<p style="font-size: 0.875rem; color: var(--amber-700);">Color: ${item.color}</p>` : ""}
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                style="background: var(--amber-100); color: var(--amber-900); border: none; width: 24px; height: 24px; border-radius: 0.25rem; cursor: pointer;">-</button>
                        <span style="font-weight: 500; min-width: 2rem; text-align: center;">${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" 
                                style="background: var(--amber-100); color: var(--amber-900); border: none; width: 24px; height: 24px; border-radius: 0.25rem; cursor: pointer;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 600; color: var(--amber-900);">${formatPrice(item.product.price * item.quantity)}</p>
                    <button onclick="cart.removeItem('${item.id}')" 
                            style="background: none; border: none; color: var(--red-500); cursor: pointer; margin-top: 0.5rem;">&times;</button>
                </div>
            </div>
        `,
      )
      .join("");

    cartTotal.textContent = `Total: ${formatPrice(this.getTotal())}`;
  }

  showAddToCartNotification(productName) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--green-600);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
    notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
                <span>${productName} added to cart</span>
            </div>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Cart modal functionality
function openCart() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.add("active");
    cart.updateCartModal();
  }
}

function closeCart() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Cart button click
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  // Close cart modal
  const closeCartBtn = document.getElementById("closeCart");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart);
  }

  // Close modal when clicking outside
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.addEventListener("click", function (e) {
      if (e.target === cartModal) {
        closeCart();
      }
    });
  }

  // Add to cart buttons on product cards
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart-btn")) {
      e.preventDefault();
      const productId = e.target.dataset.productId;
      const product = getProductById(productId);
      if (product) {
        cart.addItem(product);
      }
    }
  });
});

// Quick add to cart function for product cards
function quickAddToCart(productId) {
  const product = getProductById(productId);
  if (product) {
    cart.addItem(product);
  }
}
