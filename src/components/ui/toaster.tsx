import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  const getToastIcon = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return <XCircle className="w-5 h-5 text-rose-600 animate-in zoom-in-75 duration-500 delay-150" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 animate-in zoom-in-75 duration-500 delay-150" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 animate-in zoom-in-75 duration-500 delay-150" />
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-600 animate-in zoom-in-75 duration-500 delay-150" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                {getToastIcon(variant)}
              </div>
              <div className="grid gap-1 flex-1">
                {title && (
                  <ToastTitle className="animate-in slide-in-from-right-2 duration-300 delay-200">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="animate-in slide-in-from-right-2 duration-300 delay-300">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
