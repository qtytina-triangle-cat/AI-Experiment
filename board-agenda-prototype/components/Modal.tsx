import { AlertTriangle, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info';
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
}: ModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
      iconBg: 'bg-orange-100',
      confirmButton: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      iconBg: 'bg-red-100',
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
    },
    info: {
      icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-start gap-4 p-6">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${styles.iconBg} shrink-0`}>
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
