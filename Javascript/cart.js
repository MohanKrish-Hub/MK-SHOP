let cart = [];

const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');
const toastContainer = document.getElementById('toast-container');

// Toggle cart sidebar
cartToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent closing when clicking the toggle button
  cartSidebar.style.display = cartSidebar.style.display === 'block' ? 'none' : 'block';
});
3
// Close cart when clicking outside
document.addEventListener('click', (e) => {
  if (cartSidebar.style.display === 'block') {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
      cartSidebar.style.display = 'none';
    }
  }
});

// Prevent cart from closing when clicking inside it
cartSidebar.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Add to cart event
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function () {
    const card = this.closest('.card');
    const title = card.querySelector('.card-title').textContent;
    const priceText = card.querySelector('.card-text').textContent.replace('$', '');
    const price = parseFloat(priceText);

    cart.push({ title, price });
    updateCart();
    showToast(`✅ ${title} added to cart`, "success");
  });
});

// Update cart display
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center');
    div.innerHTML = `
      <span>${item.title} - $${item.price.toFixed(2)}</span>
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;
}

// Remove item from cart
function removeFromCart(index) {
  const removedItem = cart[index];
  cart.splice(index, 1);
  updateCart()
  showToast(`❌ ${removedItem.title} removed from cart`, "danger");
}

// Clear cart
clearCartBtn.addEventListener('click', () => {
  cart = [];
  updateCart();
  showToast('🧹 Cart cleared', "warning");
});

// Make remove function global
window.removeFromCart = removeFromCart;

// Show toast notification
function showToast(message, type) {
  const toastEl = document.createElement('div');
  toastEl.classList.add('toast', 'align-items-center', 'text-bg-' + type, 'border-0');
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
  toast.show();

  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
