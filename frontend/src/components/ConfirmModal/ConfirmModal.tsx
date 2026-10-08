import React, { useEffect, useId, useRef } from 'react'
import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
  isOpen: boolean // Открыто ли окно
  title: string // Заголовок (например, "Удаление файла")
  message: string // Текст вопроса (например, "Вы уверены?")
  confirmText?: string // Текст кнопки подтверждения
  cancelText?: string // Текст кнопки отмены
  onConfirm?: () => void // Функция при согласии (необязательная)
  onCancel: () => void // Функция при отмене/закрытии
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Да, удалить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const messageId = useId()
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    modalRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    return () => previousFocus?.focus()
  }, [isOpen])
  // Если окно закрыто — ничего не рендерим
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      {/* stopPropagation нужен, чтобы клик внутри модалки не закрывал её */}
      <div
        ref={modalRef}
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel()
          if (event.key !== 'Tab') return
          const buttons = modalRef.current?.querySelectorAll<HTMLButtonElement>('button')
          if (!buttons?.length) return
          const first = buttons[0]
          const last = buttons[buttons.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }}
      >
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        <p id={messageId} className={styles.message}>
          {message}
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          {onConfirm && (
            <button className={styles.confirmBtn} onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
