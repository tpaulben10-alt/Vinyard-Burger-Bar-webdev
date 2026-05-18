const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

function formatMoney(value) {
  const amount = Number(value);
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function statusBadge(status) {
  return `<span class="status ${status}">${status}</span>`;
}

function stepper(status) {
  const activeIndex = status === 'cancelled' ? -1 : statusSteps.indexOf(status);
  return `<div class="stepper">${statusSteps.map((step, index) => (
    `<span class="step ${index <= activeIndex ? 'active' : ''}" title="${step}"></span>`
  )).join('')}</div>`;
}

function renderOrders(orders) {
  const host = document.querySelector('[data-orders]');

  host.innerHTML = orders.map((order) => `
    <article class="card order-card" data-order="${order.id}">
      <div class="cart-row">
        <div>
          <strong>Order #${order.id}</strong>
          <div>${formatDate(order.created_at)}</div>
        </div>
        ${statusBadge(order.status)}
      </div>
      <p>${order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}</p>
      <div class="cart-row">
        <strong>${formatMoney(order.total_amount)}</strong>
      </div>
      ${stepper(order.status)}
    </article>
  `).join('') || '<div class="empty">No orders yet.</div>';
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth('customer');
  if (!user) return;

  document.querySelector('[data-user-name]').textContent = user.name;
  const { orders } = await API.request('/api/orders/my');
  renderOrders(orders);

  const socket = connectSocket();
  socket?.on('order:status_update', async () => {
    const latest = await API.request('/api/orders/my');
    renderOrders(latest.orders);
    showToast('Order status updated.');
  });
});
