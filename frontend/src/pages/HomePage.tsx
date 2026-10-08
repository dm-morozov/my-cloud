import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/store'
import { Icon } from '../components/ui/Icon'
import { StoragePreview } from '../components/StoragePreview/StoragePreview'
import styles from './HomePage.module.css'

const features = [
  {
    number: '01',
    title: 'Сохранить',
    text: 'Документы, фотографии и рабочие материалы. Перетащите файл — и он уже в вашем облаке.',
  },
  {
    number: '02',
    title: 'Найти',
    text: 'Все файлы в одном месте. Понятные имена, комментарии и быстрый доступ без лишних папок.',
  },
  {
    number: '03',
    title: 'Поделиться',
    text: 'Отправьте ссылку коллеге или другу. Получателю не нужен аккаунт, чтобы скачать файл.',
  },
]

export const HomePage = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>ВАШЕ ЛИЧНОЕ ПРОСТРАНСТВО</span>
          <h1>
            Важные файлы.
            <br />
            <em>Всегда под рукой.</em>
          </h1>
          <p className={styles.description}>
            Соберите документы, идеи и фотографии в одном месте. Открывайте, сохраняйте и делитесь —
            без лишних действий.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryBtn} to={isAuthenticated ? '/storage' : '/register'}>
              {isAuthenticated ? 'Открыть хранилище' : 'Создать своё облако'} <Icon name='arrow' />
            </Link>
            {!isAuthenticated && (
              <Link className={styles.secondaryBtn} to='/login'>
                Уже есть аккаунт?
              </Link>
            )}
          </div>
          <p className={styles.note}>100 МиБ для ваших файлов · до 20 МиБ на файл</p>
        </div>
        <StoragePreview />
      </section>
      <section className={styles.features} aria-label='Как работает My Cloud'>
        {features.map((feature) => (
          <article key={feature.number}>
            <span>{feature.number}</span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>
      <section className={styles.closing}>
        <p>
          Меньше поисков.
          <br />
          Больше порядка.
        </p>
        <Link to={isAuthenticated ? '/storage' : '/register'}>
          Перейти к файлам <Icon name='arrow' />
        </Link>
      </section>
    </div>
  )
}
