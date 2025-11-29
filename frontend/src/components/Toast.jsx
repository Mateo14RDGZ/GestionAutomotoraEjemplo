import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500 dark:border-green-700',
      icon: CheckCircle,
      iconColor: 'text-green-500 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-200'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500 dark:border-red-700',
      icon: AlertCircle,
      iconColor: 'text-red-500 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-200'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-500 dark:border-yellow-700',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500 dark:text-yellow-400',
      textColor: 'text-yellow-900 dark:text-yellow-200'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500 dark:border-blue-700',
      icon: Info,
      iconColor: 'text-blue-500 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-200'
    }
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border-l-4 p-4 rounded-lg shadow-lg flex items-start gap-3 min-w-[300px] max-w-md animate-slideInRight`}>
      <Icon className={`${config.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <p className={`${config.textColor} flex-1 text-sm font-medium`}>{message}</p>
      <button
        onClick={onClose}
        className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
