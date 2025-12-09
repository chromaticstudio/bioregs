import { Alert, AlertTitle, AlertDescription } from './alert'
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react'

type Props = {
  message?: string
  description?: string
  variant?: 'error' | 'success'
}

export function AlertMessage({ message, description, variant = 'error' }: Props) {
  if (!message) return null

  return (
    <Alert variant={variant === 'error' ? 'destructive' : 'default'}>
      {variant === 'error' ? <AlertCircleIcon /> : <CheckCircleIcon />}
      <AlertTitle>{message}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}
