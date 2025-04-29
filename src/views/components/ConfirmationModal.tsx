import React from "react";

const ConfirmationModal = ({ 
  isOpen = false, 
  onConfirm = () => {}, 
  onCancel = () => {},
  title = "Confirmación",
  message = "¿Está seguro que desea continuar?",
  confirmText = "Continuar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border border-gray-700">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-gray-100">{title}</h3>
          <p className="mt-2 text-gray-300">{message}</p>
        </div>
        
        <div className="flex items-center justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;