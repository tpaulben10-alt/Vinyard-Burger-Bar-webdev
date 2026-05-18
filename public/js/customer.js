const categoryLabels = {
  burger: 'Burgers',
  pasta: 'Pasta',
  appetizer: 'Appetizers',
  fries: 'Fries',
  wedges: 'Potato Wedges',
  rice_meal: 'Rice Meals',
  fried_chicken: 'Fried Chicken',
  coffee: 'Coffee',
  frappe: 'Frappe',
  milk_shake: 'Milk Shakes',
  beverages: 'Beverages',
  add_ons: 'Add-ons'
};
const preferredCategories = Object.keys(categoryLabels);
let menuItems = [];
let activeCategory = '';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function formatMoney(value) {
  const amount = Number(value);
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartBadge();
}

function renderCartBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (!badge) return;
  badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderTabs() {
  const tabs = document.querySelector('[data-tabs]');
  const categories = [...new Set(menuItems.map((item) => item.category))]
    .sort((a, b) => preferredCategories.indexOf(a) - preferredCategories.indexOf(b));

  if (!activeCategory) activeCategory = categories[0] || 'burger';

  tabs.innerHTML = categories.map((category) => (
    `<button class="tab ${category === activeCategory ? 'active' : ''}" data-category="${category}">${categoryLabels[category] || category}</button>`
  )).join('');

  tabs.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderTabs();
      renderMenu();
    });
  });
}

function renderMenu() {
  const grid = document.querySelector('[data-menu-grid]');
  const items = menuItems.filter((item) => item.category === activeCategory);

  grid.innerHTML = items.map((item) => `
    <article class="card menu-card">
      <img src="${item.image_url}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
        <div class="price-row">
          <span class="price">${formatMoney(item.price)}</span>
          <button data-add="${item.id}">Add</button>
        </div>
      </div>
    </article>
  `).join('') || '<div class="empty">No items in this category yet.</div>';

  grid.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.add)));
  });
}

function addToCart(id) {
  const item = menuItems.find((entry) => entry.id === id);
  const existing = cart.find((entry) => entry.menu_item_id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ menu_item_id: id, quantity: 1, name: item.name, price: Number(item.price) });
  }

  saveCart();
  renderCart();
  document.querySelector('[data-cart-drawer]').classList.add('open');
}

function updateQuantity(id, delta) {
  cart = cart.map((item) => (
    item.menu_item_id === id ? { ...item, quantity: item.quantity + delta } : item
  )).filter((item) => item.quantity > 0);

  saveCart();
  renderCart();
}

function renderCart() {
  const host = document.querySelector('[data-cart-items]');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  host.innerHTML = cart.map((item) => `
    <div class="cart-line">
      <div class="cart-row">
        <strong>${item.name}</strong>
        <span>${formatMoney(item.price * item.quantity)}</span>
      </div>
      <div class="cart-row">
        <span class="muted">${formatMoney(item.price)} each</span>
        <span class="qty">
          <button class="secondary" data-qty="${item.menu_item_id}" data-delta="-1">-</button>
          <strong>${item.quantity}</strong>
          <button class="secondary" data-qty="${item.menu_item_id}" data-delta="1">+</button>
        </span>
      </div>
    </div>
  `).join('') || '<div class="empty">Your cart is ready when you are.</div>';

  document.querySelector('[data-cart-total]').textContent = formatMoney(total);
  document.querySelector('[data-place-order]').disabled = cart.length === 0;

  host.querySelectorAll('[data-qty]').forEach((button) => {
    button.addEventListener('click', () => updateQuantity(Number(button.dataset.qty), Number(button.dataset.delta)));
  });
}

async function placeOrder() {
  const notes = document.querySelector('[data-order-notes]').value;

  try {
    const { order } = await API.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        notes,
        items: cart.map(({ menu_item_id, quantity }) => ({ menu_item_id, quantity }))
      })
    });

    cart = [];
    saveCart();
    renderCart();
    document.querySelector('[data-cart-drawer]').classList.remove('open');
    document.querySelector('[data-modal-order]').textContent = `Order #${order.id}`;
    document.querySelector('[data-confirm-modal]').classList.add('open');
  } catch (error) {
    showToast(error.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth('customer');
  if (!user) return;

  document.querySelector('[data-user-name]').textContent = user.name;
  connectSocket();
  renderCartBadge();
  renderCart();

  document.querySelector('[data-cart-open]').addEventListener('click', () => {
    document.querySelector('[data-cart-drawer]').classList.add('open');
  });
  document.querySelector('[data-cart-close]').addEventListener('click', () => {
    document.querySelector('[data-cart-drawer]').classList.remove('open');
  });
  document.querySelector('[data-place-order]').addEventListener('click', placeOrder);
  document.querySelector('[data-confirm-close]').addEventListener('click', () => {
    document.querySelector('[data-confirm-modal]').classList.remove('open');
  });

  const { items } = await API.request('/api/menu');
  menuItems = items;
  renderTabs();
  renderMenu();
});
