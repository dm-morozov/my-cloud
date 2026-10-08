import axios from 'axios'

// Создаем "настроенную" версию axios
export const api = axios.create({
  // В разработке шлем запросы на localhost:8000, в продакшене — по относительному пути /api
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api'),
  // Разрешаем передачу куки (сессий) между фронтом и бэком
  withCredentials: true,
})

// Добавляем перехватчик (interceptor) для CSRF-токена
// Перед каждым запросом axios будет пытаться достать csrftoken из куки
// и подставить в заголовки
api.interceptors.request.use(async (config) => {
  if (!['get', 'head', 'options'].includes(config.method || 'get')) {
    const response = await api.get<{ csrfToken: string }>('/users/csrf/')
    config.headers['X-CSRFToken'] = response.data.csrfToken
    return config
  }
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  const csrfToken = getCookie('csrftoken')
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }

  return config
})
