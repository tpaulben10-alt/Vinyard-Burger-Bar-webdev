function connectSocket() {
  const token = localStorage.getItem('token');

  if (!token || typeof io === 'undefined') {
    return null;
  }

  const socket = io({ auth: { token } });
  const user = getStoredUser();

  socket.on('connect', () => {
    if (user?.id) socket.emit('user:online', user.id);
  });

  window.vinyardSocket = socket;
  return socket;
}

function showToast(message) {
  let host = document.querySelector('.toast');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast';
    document.body.appendChild(host);
  }

  const item = document.createElement('div');
  item.className = 'toast-item';
  item.textContent = message;
  host.appendChild(item);

  window.setTimeout(() => item.remove(), 4200);
}
