import { projectLinks } from '../../../config/project'
import styles from './Footer.module.css'

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div>
        <strong>My Cloud</strong>
        <p>Место для того, что важно.</p>
      </div>
      <div className={styles.author}>
        <span>Дмитрий Морозов</span>
        <a href={projectLinks.telegram} target='_blank' rel='noreferrer'>
          Telegram ↗
        </a>
        <a href={projectLinks.repository} target='_blank' rel='noreferrer'>
          GitHub ↗
        </a>
      </div>
      <span className={styles.copyright}>© {new Date().getFullYear()} My Cloud</span>
    </div>
  </footer>
)
