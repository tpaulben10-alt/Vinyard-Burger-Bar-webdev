function money(value) {
  const amount = Number(value);
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

function dateTime(value) {
  return value ? new Date(value).toLocaleString() : 'Never';
}

function badge(status) {
  return `<span class="status ${status}">${status}</span>`;
}

function orderItems(order) {
  return order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ');
}

async function initAdminShell() {
  const user = await requireAuth('admin');
  if (!user) return null;
  document.querySelectorAll('[data-admin-name]').forEach((el) => { el.textContent = user.name; });
  const socket = connectSocket();
  socket?.on('order:new', (order) => showToast(`New order #${order.id} from ${order.customer_name}`));
  return { user, socket };
}

async function initDashboard() {
  const ready = await initAdminShell();
  if (!ready) return;

  const { summary } = await API.request('/api/admin/summary');
  document.querySelector('[data-total-today]').textContent = summary.totalOrdersToday;
  document.querySelector('[data-pending]').textContent = summary.pendingOrders;
  document.querySelector('[data-online]').textContent = summary.onlineCustomers;
  document.querySelector('[data-users]').textContent = summary.registeredUsers;
}

async function initOrders() {
  const ready = await initAdminShell();
  if (!ready) return;

  let orders = [];
  const host = document.querySelector('[data-orders-table]');
  const filter = document.querySelector('[data-status-filter]');

  function render() {
    const visible = filter.value === 'all' ? orders : orders.filter((order) => order.status === filter.value);

    host.innerHTML = visible.map((order) => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.customer_name}<br><small>${order.customer_email}</small></td>
        <td class="items-cell">${orderItems(order)}</td>
        <td>${money(order.total_amount)}</td>
        <td>${dateTime(order.created_at)}</td>
        <td>${badge(order.status)}</td>
        <td>
          <select data-order-status="${order.id}">
            ${['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
              `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>`
            )).join('')}
          </select>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="7">No orders found.</td></tr>';

    host.querySelectorAll('[data-order-status]').forEach((select) => {
      select.addEventListener('change', async () => {
        const { order } = await API.request(`/api/admin/orders/${select.dataset.orderStatus}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: select.value })
        });
        orders = orders.map((entry) => entry.id === order.id ? order : entry);
        render();
      });
    });
  }

  filter.addEventListener('change', render);
  const data = await API.request('/api/admin/orders');
  orders = data.orders;
  render();

  ready.socket?.on('order:new', (order) => {
    orders = [order, ...orders];
    render();
  });
  ready.socket?.on('order:status_update', (order) => {
    orders = orders.map((entry) => entry.id === order.id ? order : entry);
    render();
  });
}

async function initAccounts() {
  const ready = await initAdminShell();
  if (!ready) return;

  const { users } = await API.request('/api/admin/users');
  const host = document.querySelector('[data-users-table]');
  const search = document.querySelector('[data-user-search]');
  const role = document.querySelector('[data-role-filter]');

  function render() {
    const query = search.value.toLowerCase();
    const visible = users.filter((user) => {
      const matchesQuery = user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      const matchesRole = role.value === 'all' || user.role === role.value;
      return matchesQuery && matchesRole;
    });

    host.innerHTML = visible.map((user) => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${dateTime(user.created_at)}</td>
        <td>${dateTime(user.last_seen)}</td>
      </tr>
    `).join('') || '<tr><td colspan="6">No accounts found.</td></tr>';
  }

  search.addEventListener('input', render);
  role.addEventListener('change', render);
  render();
}

async function initOnlineUsers() {
  const ready = await initAdminShell();
  if (!ready) return;

  const host = document.querySelector('[data-online-table]');

  function render(users) {
    host.innerHTML = users.map((user) => `
      <tr>
        <td><span class="online-dot"></span>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${dateTime(user.last_seen)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4">No one is online right now.</td></tr>';
  }

  const { users } = await API.request('/api/admin/users/online');
  render(users);
  ready.socket?.on('admin:online_users', render);
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'admin-dashboard') initDashboard();
  if (page === 'admin-orders') initOrders();
  if (page === 'admin-accounts') initAccounts();
  if (page === 'admin-online') initOnlineUsers();
});
