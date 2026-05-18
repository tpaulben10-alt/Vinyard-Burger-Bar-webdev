const API = {
  async request(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(path, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Request failed.');
    }

    return data;
  }
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
}

function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
}

async function requireAuth(role) {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/index.html';
    return null;
  }

  try {
    const { user } = await API.request('/api/auth/me');

    if (role && user.role !== role) {
      window.location.href = user.role === 'admin' ? '/admin/dashboard.html' : '/customer/dashboard.html';
      return null;
    }

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    clearSession();
    window.location.href = '/index.html';
    return null;
  }
}

async function logout() {
  try {
    await API.request('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.warn(error.message);
  }

  if (window.vinyardSocket) {
    window.vinyardSocket.emit('user:offline');
    window.vinyardSocket.disconnect();
  }

  clearSession();
  window.location.href = '/index.html';
}

function bindLogout() {
  document.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', logout);
  });
}

function redirectForRole(user) {
  window.location.href = user.role === 'admin' ? '/admin/dashboard.html' : '/customer/dashboard.html';
}

document.addEventListener('DOMContentLoaded', () => {
  bindLogout();

  const loginForm = document.querySelector('[data-login-form]');
  const registerForm = document.querySelector('[data-register-form]');
  const message = document.querySelector('[data-message]');

  const params = new URLSearchParams(window.location.search);
  if (params.get('registered') && message) {
    message.textContent = 'Account created. You can log in now.';
  }

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';

    const body = Object.fromEntries(new FormData(loginForm));

    try {
      const { token, user } = await API.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setSession(token, user);
      redirectForRole(user);
    } catch (error) {
      message.textContent = error.message;
    }
  });

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';

    const body = Object.fromEntries(new FormData(registerForm));
    if (body.password !== body.confirmPassword) {
      message.textContent = 'Passwords do not match.';
      return;
    }

    try {
      await API.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: body.name, email: body.email, password: body.password })
      });
      window.location.href = '/index.html?registered=1';
    } catch (error) {
      message.textContent = error.message;
    }
  });
});
