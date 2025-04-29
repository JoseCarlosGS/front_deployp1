import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppProvider} from './../../contexts/AppContext';
import { ProjectServices } from '../../services/ProjectServices';
import { getCurrentUser } from '../../services/LoginServices';
import { useAppContext } from './../../contexts/AppContext';


const Home = () => {
  const projectServices = ProjectServices
  const { setCurrentProject } = useAppContext();
  //const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  
  const [currentIndex, setCurrentIndex] = useState(0);

  const userId = getCurrentUser();

  useEffect(() => {
    setCurrentProject(null)
    localStorage.removeItem('currentProject')
  },[])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projects = await projectServices.getAllProjectsByUserId(userId!);
        setProyectos(projects);
        setError(null); 
      } catch (err: any) {
        setError(err.message || 'Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    // Llama a la función
    if (userId) {
      fetchProjects();
    } else {
      setError('ID de usuario no encontrado');
      setLoading(false);
    }
  }, [userId]);

  const newProject = () => {
    localStorage.removeItem('gjsProject')
    sessionStorage.removeItem('currentProject')
    setCurrentProject(null)
    navigate('/editor')
  }
  
  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % proyectos.length);
  };
  
  const prevProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + proyectos.length) % proyectos.length);
  };
  
  const editProject = (project:any) => {
    console.log('cargando el proyecto: ', project.id)
    sessionStorage.setItem('currentProject', project.id.toString())
    setCurrentProject(project)
    navigate(`/editor`);
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <AppProvider>
        <Navbar />
      </AppProvider>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 bg-gray-800">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Mis Proyectos</h1>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => newProject()}
          >
            <PlusCircle size={20} className="mr-2" />
            Nuevo Proyecto
          </button>
        </div>

        {/* Verifica el estado de carga */}
        {loading && (
          <div className="text-center text-gray-400">Cargando proyectos...</div>
        )}

        {/* Muestra errores si existen */}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {/* Slider de Proyectos */}
        {!loading && !error && proyectos.length > 0 && (
          <div className="bg-gray-500 rounded-lg shadow-md p-6 relative">
            <div className="flex items-center">
              <button
                onClick={prevProject}
                className="absolute left-4 bg-gray-600 rounded-full p-2 shadow-md hover:bg-gray-400"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="w-full px-12">
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold text-gray-200 mb-2">
                    {proyectos[currentIndex].name}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {proyectos[currentIndex].description}
                  </p>

                  <div className="flex space-x-4 mt-6">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                      Ver Detalles
                    </button>
                    <button 
                    onClick={() => editProject(proyectos[currentIndex])}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={nextProject}
                className="absolute right-4 bg-gray-600 rounded-full p-2 shadow-md hover:bg-gray-400"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center mt-6 space-x-2">
              {proyectos.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay proyectos */}
        {!loading && !error && proyectos.length === 0 && (
          <div className="text-center text-gray-400">No hay proyectos disponibles.</div>
        )}

        {/* Resumen de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Proyectos Activos</h3>
            <p className="text-3xl font-bold text-blue-500">{proyectos.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Completados</h3>
            <p className="text-3xl font-bold text-green-500">0</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Pendientes</h3>
            <p className="text-3xl font-bold text-orange-500">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;