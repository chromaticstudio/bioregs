import { Spinner } from '@/components/ui/spinner'

export function LoadingView() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  )
}
