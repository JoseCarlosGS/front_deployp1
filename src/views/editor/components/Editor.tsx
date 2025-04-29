import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { customBlocks } from '../../../constants/CustomBlocks';
import Navbar from '../../components/Navbar';
import { useAppContext} from '../../../contexts/AppContext';
import ChatPanel from './ChatPanel';
import GrapesEditor from './../components/GrapesEditor';
import { ProjectServices } from '../../../services/ProjectServices';

const Editor: React.FC = () => {
  const {currentProject} = useAppContext()
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { editor } = useAppContext();
  const [projectId, setProjectId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //const socket = useRef(io('http://localhost:3000')); // Conexión a Socket.IO

  useEffect(() => {
    console.log('context: ',currentProject)
    const id = currentProject?.id || 0
    if (id) {
      setProjectId(parseInt(id));
      sessionStorage.setItem('currentProject',id)
    }
    if (!editorRef.current) return;

    // Inicializar GrapesJS
    const e = grapesjs.init({
        container: '#gjs',
        fromElement: true,
        height: '100vh',
        width: '100%',
        storageManager: false, // Desactivar almacenamiento automático
        blockManager: {
          //appendTo: '#blocks',
        },
        
      })
      customBlocks.forEach(block => e.BlockManager.add(block.id, block));
  }, []);

  // Esperar a que editor y projectId estén disponibles
  useEffect(() => {
    if (editor && projectId !== null) {
      handleImportFromServer(projectId);
    }
  }, [editor, projectId]);

  const handleImportFromServer = async (id: number) => {
    setIsLoading(true);
    setErrorMessage(null);
  
    try {
      const json = await ProjectServices.fetchProjectFile(id);
      if (editor?.Projects?.getCurrent()?.setData) {
        await editor.Projects.getCurrent().setData(json);
      } else if (editor?.loadProjectData) {
        await editor.loadProjectData(json);
      } else if (editor?.Projects?.loadProjectData) {
        await editor.Projects.loadProjectData(json);
      } else {
        setErrorMessage("No se encontró un método válido para cargar el proyecto.");
      }
  
      //console.log("Proyecto importado desde el backend con éxito");
      setErrorMessage(null)
    } catch (error) {
      console.error("Error al importar el archivo desde el servidor:", error);
      //setErrorMessage("Hubo un error al cargar el proyecto.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
  
      {isLoading && (
        <div className="flex items-center justify-center py-4 text-yellow-800">
          <svg className="animate-spin h-5 w-5 mr-2 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Cargando proyecto...
        </div>
      )}
  
      {errorMessage && (
        <div className="p-2 bg-red-100 text-red-800 text-center">
          {errorMessage}
        </div>
      )}
      {/* Contenedor principal debajo del navbar */}
      <div className="flex flex-row flex-grow overflow-hidden h-full">
        {/* ChatPanel se encarga de su ancho internamente */}
        <div className="h-full overflow-hidden">
          <ChatPanel />
        </div>
  
        {/* GrapesEditor ocupa el resto */}
        <div className="flex-grow h-full overflow-hidden">
          <GrapesEditor />
        </div>
      </div>
    </div>
  );
};

export default Editor;