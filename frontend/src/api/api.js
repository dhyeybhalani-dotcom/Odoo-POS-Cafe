import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── Request Interceptor ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jorshor_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jorshor_token')
      localStorage.removeItem('jorshor_user')
      if(window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
         window.location.href = '/login'
      }
    }
    return Promise.reject(error.response?.data || error)
  }
)

// ── Auth API ─────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
  me: () =>
    api.get('/auth/me'),
  logout: () =>
    api.post('/auth/logout'),
  updateProfile: (data) =>
    api.put('/auth/profile', data),
}

// ── Products API ──────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) =>
    api.get('/products', { params }),
  getById: (id) =>
    api.get(`/products/${id}`),
  create: (data) =>
    api.post('/products', data),
  update: (id, data) =>
    api.put(`/products/${id}`, data),
  delete: (id) =>
    api.delete(`/products/${id}`),
  archive: (id) =>
    api.patch(`/products/${id}/archive`),
}

// ── Categories API ────────────────────────────────────
export const categoriesAPI = {
  getAll: () =>
    api.get('/categories'),
  create: (data) =>
    api.post('/categories', data),
  update: (id, data) =>
    api.put(`/categories/${id}`, data),
  delete: (id) =>
    api.delete(`/categories/${id}`),
}

// ── Orders API ────────────────────────────────────────
export const ordersAPI = {
  getAll: (params = {}) =>
    api.get('/orders', { params }),
  getById: (id) =>
    api.get(`/orders/${id}`),
  create: (data) =>
    api.post('/orders', data),
  updateStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }),
  delete: (id) =>
    api.delete(`/orders/${id}`),
}

// ── Payments API ──────────────────────────────────────
export const paymentsAPI = {
  getAll: (params = {}) =>
    api.get('/payments', { params }),
  create: (data) =>
    api.post('/payments', data),
}

// ── Customers API ─────────────────────────────────────
export const customersAPI = {
  getAll: (params = {}) =>
    api.get('/customers', { params }),
  getById: (id) =>
    api.get(`/customers/${id}`),
  create: (data) =>
    api.post('/customers', data),
  update: (id, data) =>
    api.put(`/customers/${id}`, data),
  delete: (id) =>
    api.delete(`/customers/${id}`),
}

// ── Tables API ────────────────────────────────────────
export const tablesAPI = {
  getAll: (params = {}) =>
    api.get('/tables', { params }),
  create: (data) =>
    api.post('/tables', data),
  update: (id, data) =>
    api.put(`/tables/${id}`, data),
  delete: (id) =>
    api.delete(`/tables/${id}`),
  updateStatus: (id, status) =>
    api.patch(`/tables/${id}/status`, { status }),
}

// ── Floor Plans API ───────────────────────────────────
export const floorPlansAPI = {
  getAll: () =>
    api.get('/floor-plans'),
  create: (data) =>
    api.post('/floor-plans', data),
  update: (id, data) =>
    api.put(`/floor-plans/${id}`, data),
  delete: (id) =>
    api.delete(`/floor-plans/${id}`),
}

// ── Analytics API ─────────────────────────────────────
export const analyticsAPI = {
  getDashboard: (params = {}) =>
    api.get('/analytics/dashboard', { params }),
  getSummary: () =>
    api.get('/analytics/summary'),
}

// ── Sessions API ──────────────────────────────────────
export const sessionsAPI = {
  getActive: () =>
    api.get('/sessions/active'),
  open: (data) =>
    api.post('/sessions/open', data),
  close: (id, data) =>
    api.post(`/sessions/close/${id}`, data),
}

// ── Settings API ──────────────────────────────────────
export const settingsAPI = {
  getAll: () =>
    api.get('/settings'),
  update: (data) =>
    api.post('/settings', data),
}

export default api
