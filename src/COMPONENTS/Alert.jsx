import React from 'react';
import { XMarkIcon, ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Alert({ type = 'error', message, onClose }) {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/30',
          text: 'text-green-400',
          icon: <CheckCircleIcon className="w-5 h-5" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/30',
          text: 'text-yellow-400',
          icon: <ExclamationCircleIcon className="w-5 h-5" />
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          text: 'text-blue-400',
          icon: <InformationCircleIcon className="w-5 h-5" />
        };
      default: // error
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          text: 'text-red-400',
          icon: <ExclamationCircleIcon className="w-5 h-5" />
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`${styles.bg} border rounded-lg p-4 mb-4 flex items-start gap-3`}>
      <div className={styles.text}>
        {styles.icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm ${styles.text} font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${styles.text} hover:opacity-70 transition`}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
