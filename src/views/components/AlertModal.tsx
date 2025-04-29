import React from "react";

interface AlertModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  message?: string;
  confirmText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen = false,
  onClose = () => {},
  icon = null,
  message = "Algo sucedió.",
  confirmText = "Aceptar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 border border-gray-700 flex flex-col items-center">
        
        {/* Icono */}
        {icon && <div className="text-5xl text-blue-400 mb-4">{icon}</div>}
        
        {/* Mensaje */}
        <div className="text-gray-100 text-center text-lg mb-6">
          {message}
        </div>

        {/* Botón Aceptar */}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
