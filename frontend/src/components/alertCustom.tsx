// alert-dialog-custom.tsx
import * as React from "react"
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { cn } from "../lib/utils"

type AlertType = "success" | "error" | "warning" | "info"

interface CustomAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  type?: AlertType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  hideCancel?: boolean
  autoClose?: number
}

export function CustomAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  hideCancel = false,
  autoClose,
}: CustomAlertDialogProps) {
  // Auto close functionality
  React.useEffect(() => {
    if (autoClose && open) {
      const timer = setTimeout(() => {
        onOpenChange(false)
        if (onConfirm) onConfirm()
      }, autoClose)
      
      return () => clearTimeout(timer)
    }
  }, [autoClose, open, onOpenChange, onConfirm])

  // Alert type colors and icons
  const alertStyles = {
    success: {
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircle,
    },
    error: {
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: XCircle,
    },
    warning: {
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: AlertTriangle,
    },
    info: {
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Info,
    },
  }

  const { icon: Icon, iconColor, bgColor, borderColor } = alertStyles[type]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn("border-2", borderColor, bgColor)}>
        <AlertDialogHeader className="gap-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
          <AlertDialogTitle className="text-center text-xl">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          {!hideCancel && (
            <AlertDialogCancel
              onClick={onCancel}
              className="border-gray-200 hover:bg-gray-100 hover:text-gray-900"
            >
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "text-white",
              type === "success" && "bg-green-500 hover:bg-green-600",
              type === "error" && "bg-red-500 hover:bg-red-600",
              type === "warning" && "bg-amber-500 hover:bg-amber-600",
              type === "info" && "bg-blue-500 hover:bg-blue-600"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
