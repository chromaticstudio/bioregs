type Props = {
  message?: string
}

export function ErrorAlert({ message }: Props) {
  if (!message) return null
  
  return (
    <div className="rounded-md bg-destructive/15 border border-destructive/50 p-3">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  )
}
