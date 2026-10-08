import { FormField } from '../../components/ui/FormField'
import { useState } from 'react'
import styles from './AuthForm.module.css'
import { api } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/store'
import type { AxiosError } from 'axios'
import { loginSuccess } from '../../store/authSlice'
import ErrorView from '../../components/ErrorView/ErrorView'

export const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // Место для хранения текста ошибки
  const [error, setError] = useState('')
  // Индикатор процесса сетевого запроса
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await api.post('/users/register/', {
        username,
        email,
        password,
        first_name: firstName, // Трансформируем camelCase в snake_case специально для Django
        last_name: lastName, // Трансформируем camelCase в snake_case специально для Django
      })

      // Выполняем физический вход, чтобы бэкенд выдал нам куку
      await api.post('/users/login/', { username, password })

      // Автоматический логин после регистрации
      const meResponse = await api.get('/users/me/')
      dispatch(loginSuccess(meResponse.data))

      // Перенаправляем пользователя прямиком в хранилище
      navigate('/storage')
    } catch (err: unknown) {
      // Приводим тип к AxiosError и описываем форму JSON-данных, которую возвращает Django
      const axiosError = err as AxiosError<{
        detail?: string // Общая ошибка (например, сбой сервера)
        username?: string[] // Массив ошибок валидации логина
        password?: string[] // Массив ошибок валидации пароля
        email?: string[] // Массив ошибок валидации почты
      }>

      const data = axiosError.response?.data

      // Каскадный разбор проверяем поля по очереди
      if (data) {
        if (data.username) {
          setError(data.username[0]) // Выведет например: "Логин должен начинаться с латинской буквы..."
        } else if (data.password) {
          setError(data.password[0]) // Выведет например: "Пароль должен содержать хотя бы одну цифру."
        } else if (data.email) {
          setError(data.email[0]) // Выведет например: "Пользователь с таким email уже существует."
        } else if (data.detail) {
          setError(data.detail) // Глобальная ошибка от DRF
        } else {
          setError('Ошибка при регистрации. Проверьте данные.')
        }
      } else {
        setError('Сетевая ошибка: сервер недоступен')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Ваше новое облако</h2>
      <p className={styles.intro}>
        Личное пространство для ваших файлов. Начните с создания аккаунта.
      </p>

      {error && <ErrorView message={error} />}

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          label='Логин (буквы и цифры)'
          className={styles.input}
          type='text'
          placeholder='Например, morozov'
          required // HTML5 валидация: браузер не даст отправить пустую форму
          value={username}
          onChange={(e) => setUsername(e.target.value)} // На каждый клик обновляем state
          name='username'
          autoComplete='username'
        />
        <FormField
          label='E-mail'
          className={styles.input}
          type='email'
          placeholder='you@example.com'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name='email'
          autoComplete='email'
        />
        <FormField
          label='Пароль'
          className={styles.input}
          type='password'
          placeholder='Придумайте пароль'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name='password'
          autoComplete='new-password'
        />
        <FormField
          label='Имя (необязательно)'
          className={styles.input}
          type='text'
          placeholder='Дмитрий'
          value={firstName}
          name='first_name'
          autoComplete='given-name'
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FormField
          label='Фамилия (необязательно)'
          className={styles.input}
          type='text'
          placeholder='Морозов'
          value={lastName}
          name='last_name'
          autoComplete='family-name'
          onChange={(e) => setLastName(e.target.value)}
        />
        <button className={styles.button} type='submit' disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Создать аккаунт'}
        </button>
        <p className={styles.hint}>
          Логин: 4–20 латинских букв и цифр, начинается с буквы. Пароль: от 6 символов, с заглавной
          буквой, цифрой и специальным символом.
        </p>
      </form>
    </div>
  )
}
