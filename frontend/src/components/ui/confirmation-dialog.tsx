import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { AlertTriangle } from 'lucide-react'
  
  interface ConfirmationDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    description?: string
    itemName?: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
  }
  
  export default function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Delete',
    description = 'Are you sure you want to delete this item? This action cannot be undone.',
    itemName,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
  }: ConfirmationDialogProps) {
    const handleConfirm = () => {
      onConfirm()
    }
  
    const variantStyles = {
      danger: {
        iconBg: 'bg-red-100 dark:bg-red-900/20',
        iconColor: 'text-red-600 dark:text-red-400',
        buttonBg: 'bg-red-600 hover:bg-red-700',
        buttonText: 'text-white',
      },
      warning: {
        iconBg: 'bg-orange-100 dark:bg-orange-900/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        buttonBg: 'bg-orange-600 hover:bg-orange-700',
        buttonText: 'text-white',
      },
      info: {
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        buttonText: 'text-white',
      },
      default: {
        icon: AlertTriangle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonClass: 'bg-blue-600 hover:bg-blue-700'
      },
    }
  
    const styles = variantStyles[variant]
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className={`h-12 w-12 rounded-full ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
                <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 dark:text-gray-400 pt-2">
              {description}
              {itemName && (
                <span className="block mt-2 font-semibold text-gray-900 dark:text-white">
                  "{itemName}"
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
  
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`${styles.buttonBg} ${styles.buttonText}`}
            >
              {isLoading ? 'Deleting...' : confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }