import { useState, useCallback } from 'react'

type DeleteItem = {
  id: string
  name: string
}

export function useDeleteDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null)

  const openDialog = useCallback((id: string, name: string) => {
    setItemToDelete({ id, name })
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setItemToDelete(null)
  }, [])

  const confirmDelete = useCallback((onDelete: (id: string) => void) => {
    if (itemToDelete) {
      onDelete(itemToDelete.id)
      closeDialog()
    }
  }, [itemToDelete, closeDialog])

  return {
    isOpen,
    itemToDelete,
    openDialog,
    closeDialog,
    confirmDelete,
  }
}
