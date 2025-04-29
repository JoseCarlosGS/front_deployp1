import React, { useState } from 'react';
import { register } from '../../services/LoginServices';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../components/AlertModal';
import { CheckCircleIcon } from 'lucide-react';

const Register: React.FC = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false)
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password")

        const payload = {
            name: name as string,
            email:email as string,
            password: password as string
        }

        //console.log(payload)
    
        try {
          // Llamar al servicio de autenticación
          await register(payload);
          // Redirigir al usuario o realizar alguna acción adicional
          //console.log('Registro completo');
          setShowConfirmation(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000); // Delay redirection by 3 seconds
        } catch (err: any) {
          setError(err.message || 'Error al registrar');
        } finally {
          setLoading(false);
        }
      };

return(
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-600 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white">Nueva Cuenta</h2>

        {/* Mensaje de error */}
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="usuario@example.com"
            />
          </div>
          {/* Campo de nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name='name'
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="usuario@example.com"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name='password'
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {/* Enlace para recuperar contraseña */}
        <div className="text-center">
          <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-200">
            ¿Ya tienes una cuenta? Inicia sesion aquí.
          </a>
        </div>
      </div>
      <AlertModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        icon={<CheckCircleIcon size={48} />}
        message="Registro exitoso, seras redirigido a la pagina de inicio de session"
        confirmText="Entendido"
      />
    </div>

);
}

export default Register;