// use-custom-alert.tsx
import  { useState } from "react"
import { CustomAlertDialog } from "../components/alertCustom"

type AlertType = "success" | "error" | "warning" | "info"

interface AlertOptions {
  title: string
  description?: string
  type?: AlertType
  confirmText?: string
  cancelText?: string
  hideCancel?: boolean
  autoClose?: number
}

export function useCustomAlert() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<AlertOptions>({
    title: "",
    type: "info",
  })
  const [resolveRef, setResolveRef] = useState<(value: boolean) => void>()

  const showAlert = (newOptions: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(newOptions)
      setOpen(true)
      setResolveRef(() => resolve)
    })
  }

  const handleConfirm = () => {
    setOpen(false)
    if (resolveRef) resolveRef(true)
  }

  const handleCancel = () => {
    setOpen(false)
    if (resolveRef) resolveRef(false)
  }

  const AlertComponent = (
    <CustomAlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen && resolveRef) resolveRef(false)
      }}
      title={options.title}
      description={options.description}
      type={options.type}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      hideCancel={options.hideCancel}
      autoClose={options.autoClose}
    />
  )

  // Helper methods for common alert types
  const success = (title: string, description?: string, autoClose = 2000) =>
    showAlert({
      title,
      description,
      type: "success",
      hideCancel: true,
      autoClose,
    })

  const error = (title: string, description?: string) =>
    showAlert({
      title,
      description,
      type: "error",
      confirmText: "OK",
      hideCancel: true,
    })

  const confirm = (title: string, description?: string, type: AlertType = "warning") =>
    showAlert({
      title,
      description,
      type,
      confirmText: "Yes, continue",
      cancelText: "Cancel",
    })

  const info = (title: string, description?: string) =>
    showAlert({
      title,
      description,
      type: "info",
      confirmText: "OK",
      hideCancel: true,
    })

  return {
    AlertComponent,
    showAlert,
    success,
    error,
    confirm,
    info,
  }
}
