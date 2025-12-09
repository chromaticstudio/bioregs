import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function PageContainer({ children }: Props) {
  return (
    <div className="flex flex-col items-center space-y-6 mt-14 pt-16 p-6">
      {children}
    </div>
  )
}
