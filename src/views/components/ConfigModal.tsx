import React, { useState } from "react";

interface ConfigModalProps {
  isOpen?: boolean;
  onCancel?: () => void;
  onSubmit?: (config: ConfigData) => void;
}

export interface ConfigData {
  project_name: string;
  standalone: boolean;
  installDependencies: boolean;
  routing: boolean;
  style: string;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen = false,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  const [project_name, setProjectName] = useState("");
  const [standalone, setStandalone] = useState(false);
  const [installDependencies, setInstallDependencies] = useState(true);
  const [routing, setRouting] = useState(false);
  const [style, setStyle] = useState("css");
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && project_name.trim() === "";

  const handleSubmit = () => {
    setTouched(true);
    if (project_name.trim() === "") return;

    const config: ConfigData = {
      project_name,
      standalone,
      installDependencies,
      routing,
      style,
    };
    onSubmit(config); // Envía los datos al padre
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border border-gray-700 relative">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-gray-100">Configuración del Proyecto</h3>

          <div className="mt-4 space-y-4">
            {/* Input nombre con validación */}
            <div>
              <label className="block text-gray-300 mb-1">Nombre del Proyecto</label>
              <input
                type="text"
                value={project_name}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setTouched(true)}
                className={`w-full px-3 py-2 rounded-md bg-gray-700 text-gray-100 border ${
                  isInvalid ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
                placeholder="mi-aplicacion"
              />
              {isInvalid && (
                <p className="text-red-400 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={standalone}
                  onChange={() => setStandalone(!standalone)}
                  className="mr-2"
                />
                Usar Standalone Components
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={installDependencies}
                  onChange={() => setInstallDependencies(!installDependencies)}
                  className="mr-2"
                />
                Instalar Dependencias
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={routing}
                  onChange={() => setRouting(!routing)}
                  className="mr-2"
                />
                Incluir Routing
              </label>
            </div>

            {/* Combo de estilos */}
            <div>
              <label className="block text-gray-300 mb-1">Hoja de Estilos</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="css">CSS</option>
                <option value="scss">SCSS</option>
                <option value="sass">SASS</option>
                <option value="less">LESS</option>
                <option value="styl">Stylus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;



