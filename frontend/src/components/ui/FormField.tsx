import { useId, type InputHTMLAttributes } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export const FormField = ({ label, id, ...props }: FormFieldProps) => {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <label className='form-field' htmlFor={inputId}>
      <span>{label}</span>
      <input id={inputId} {...props} />
    </label>
  )
}
