import styles from './Spinner.module.css'

const Spinner = () => {
  return (
    <div className={styles.preloader} role='status' aria-label='Загрузка'>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export default Spinner
