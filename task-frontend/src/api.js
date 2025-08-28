import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export const API = axios.create({ baseURL })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ------------------ Auth ------------------
export const signup = (payload) => API.post('/signup', payload)

export const login = async (username, password) => {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  return API.post('/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// ------------------ User ------------------
export const getProfile = () => API.get('/me')

// ------------------ Tasks ------------------
export const getTasks = (query = {}) => API.get('/tasks', { params: query })
export const getTask = (id) => API.get(`/tasks/${id}`)
export const createTask = (payload) => API.post('/tasks', payload)
export const updateTask = (id, payload) => API.put(`/tasks/${id}`, payload)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)
