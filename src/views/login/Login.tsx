import React, { useState } from 'react';
import { login } from '../../services/LoginServices'
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Llamar al servicio de autenticación
      await login(email, password);
      // Redirigir al usuario o realizar alguna acción adicional
      //console.log('Inicio de sesión exitoso');
      navigate('/')
    } catch (err: any) {
      //console.log(err)
      if (err.status == 401) setError('Credenciales incorrectas')
      else
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-600 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlace para recuperar contraseña */}
        <div className="text-center">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-200">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="text-center">
          <a href="/register" className="text-sm text-indigo-600 hover:text-indigo-200">
            ¿No tienes una cuenta? Registrate aquí.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;