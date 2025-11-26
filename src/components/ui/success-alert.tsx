type Props = {
  message: string
}

export function SuccessAlert({ message }: Props) {
  if (!message) return null
  
  return (
    <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
      <p className="text-sm text-green-800 dark:text-green-400">{message}</p>
    </div>
  )
}
