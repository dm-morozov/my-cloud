import { Icon } from '../ui/Icon'
import styles from './StoragePreview.module.css'

const examples = [
  { name: 'Концепция проекта.pdf', type: 'PDF', size: '2,4 МиБ', color: 'sand' },
  { name: 'Выходные у моря.jpg', type: 'JPG', size: '5,8 МиБ', color: 'sage' },
  { name: 'Заметки к встрече.txt', type: 'TXT', size: '12 КиБ', color: 'stone' },
]

export const StoragePreview = () => (
  <div className={styles.scene} aria-label='Пример интерфейса хранилища'>
    <div className={styles.caption}>ПОРЯДОК НАЧИНАЕТСЯ ЗДЕСЬ</div>
    <div className={styles.window}>
      <div className={styles.top}>
        <span>
          <Icon name='cloud' /> My Cloud
        </span>
        <span className={styles.avatar}>ДМ</span>
      </div>
      <div className={styles.heading}>
        <div>
          <small>ЛИЧНОЕ ХРАНИЛИЩЕ</small>
          <h2>Мои файлы</h2>
        </div>
        <Icon name='upload' />
      </div>
      <div className={styles.tableLabel}>
        <span>Название</span>
        <span>Размер</span>
      </div>
      {examples.map((file) => (
        <div className={styles.row} key={file.name}>
          <span className={styles[file.color]}>
            <Icon name='file' />
          </span>
          <div>
            <strong>{file.name}</strong>
            <small>{file.type} · Личный файл</small>
          </div>
          <span>{file.size}</span>
        </div>
      ))}
      <div className={styles.space}>
        <span>8,2 из 100 МиБ</span>
        <div>
          <i />
        </div>
      </div>
    </div>
    <div className={styles.footnote}>
      <span>01 /</span> Иллюстрация хранилища. Ваши файлы видны только вам.
    </div>
  </div>
)
