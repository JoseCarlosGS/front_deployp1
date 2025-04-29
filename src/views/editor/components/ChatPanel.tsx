import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, MessageSquare, ChevronLeft, ChevronRight, Send, Plus, Trash } from 'lucide-react';
import { ProjectServices } from '../../../services/ProjectServices';
import { User } from '../../../interfaces/User';
import { UserServices } from '../../../services/UserServices';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getCurrentUser } from '../../../services/LoginServices';
import { useWebSocketContext } from '../../../contexts/WebSocketContext';
import { useAppContext } from '../../../contexts/AppContext';

// Definición de tipos

interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

const ChatPanel: React.FC<any> = () => {
  // Estados
  const { currentProject } = useAppContext()
  const [isOpen, setIsOpen] = useState(true);
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false);
  const [deleteUser, setDeteleUser] = useState<User | null>(null);
  const [isSaved, setIsSaved] = useState(false)
  //const [onlineUsers, setOnlineUsers] = useState<User[] | undefined>(undefined);

  //const { sendMessage, lastChatMessage, onlineUsers, messageHistory, readyState } = useWebSocketContext();
  const socketContext = useWebSocketContext();

  if (!socketContext) {
    return <div>Cargando conexión...</div>; // O puedes mostrar un loader/spinner
  }

  const { sendMessage, lastChatMessage, onlineUsers, messageHistory, readyState } = socketContext;

  const [userId] = useState(() => {
    const storedId = sessionStorage.getItem('user_id');
    if (storedId) return storedId;
  });

  useEffect(() => {
    //console.log(lastChatMessage)
    setMessages(prev => [...prev, lastChatMessage]);
  }, [lastChatMessage]);

  // Al iniciar, cargar el historial
  useEffect(() => {
    setMessages(messageHistory);
  }, [messageHistory]);

  useEffect(() => {
    if (currentProject !== null) {
      fetchUsers();
      setIsSaved(true)
    }
  }, [currentProject]);

  const fetchUsers = async () => {
    try {
      const data = await ProjectServices.getAllUsersByProjectId(parseInt(currentProject!.id));
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isLogedUser = (id: number) => {
    const currentUserId = getCurrentUser()
    return currentUserId == id
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageToSend = {
      type: "chat-message",
      text: newMessage.trim()
    };
    console.log("Enviando mensaje:", messageToSend);

    sendMessage(JSON.stringify(messageToSend));
    setNewMessage('');
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return 'Desconectado';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;

    return formatTime(date);
  };

  const searchUser = async (email: string) => {
    setError('')
    try {
      const user = await UserServices.getByEmail(email);
      setFoundUser(user);
    }
    catch (error) {
      setError(error as string)
    }
  };

  const handleConfirm = async () => {
    console.log("Usuario confirmó la acción");
    try {
      await ProjectServices.removeUserToProject(parseInt(currentProject!.id), deleteUser?.id!)
    } catch (error) {
      console.error('Error al eliminar al usuario', error)
    } finally {
      setShowAlert(false);
      fetchUsers()
    }
  };

  const handleAddUser = async () => {
    setError('')
    if (foundUser) {
      setIsLoading(true)
      try {
        await ProjectServices.addUserToProject(parseInt(currentProject!.id), foundUser.id);
      }
      catch (error) {
        setError(error as string)
      }
      finally {
        setIsLoading(false)
        setShowAddUserModal(false); // cerrar modal
        setFoundUser(null); // limpiar
        setEmail('');
        fetchUsers()
      }
    }
  };

  const isOnline = (user: User) => {
    if (!user || onlineUsers === undefined) return false;
    return onlineUsers!.some(onlineUser => onlineUser.id === user.id);
  };

  return (
    <div className="h-full relative z-20">
      {/* Botón fijo a la izquierda de la pantalla */}
      {!isOpen && (
        <div className="fixed top-0.9 left-0 transform -translate-y-1/2">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-700 text-white rounded-r-md shadow-md opacity-30 hover:opacity-100 transition-opacity duration-300 w-8 h-10 flex items-center justify-center"
          >
            ☰
          </button>
        </div>
      )}
      {/* Panel principal */}
      <div
        className={`bg-gray-900 border-r border-gray-900 flex flex-col transition-all duration-200 ${isOpen ? "w-64" : "w-0 h-0"
          } ${!isOpen ? "overflow-hidden" : ""}`}
        style={{ minWidth: 0 }}
      >
        <div className="flex items-center justify-between border-b border-gray-800 max-h-10">
          <h2 className="font-bold text-white flex items-center m-4">
            Proyecto
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-gray-200"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Sección de usuarios */}
        <div className="flex-1 p-3 border-b border-gray-200 min-h-60 max-h-60 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 max-h-6">
            {/* Título con ícono */}
            <h2 className="text-sm font-semibold text-white flex items-center">
              <UserCircle className="mr-2" size={18} />
              Miembros ({users?.filter((u) => u.online).length}/{users?.length})
            </h2>

            {/* Botón más pequeño y alineado a la derecha */}
            <button
              type="button"
              onClick={() => {
                setShowAddUserModal(true);
                setError('');
              }}
              disabled={!isSaved}
              title={!isSaved ? "Debe guardar el proyecto para poder añadir colaboradores" : ""}
              className={`flex items-center text-xs font-medium rounded-md px-2 py-1 space-x-1 transition-colors
                  ${isSaved
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 bg-gray-800 cursor-not-allowed"}
                `}
            >
              <Plus size={14} />
              <span>Añadir</span>
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2 hover:bg-gray-800 rounded-md px-2"
              >
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline(user) ? "bg-green-500" : "bg-gray-400"
                        }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {isOnline(user)
                        ? "En línea"
                        : formatLastSeen(user.last_login ? new Date(user.last_login) : undefined)}
                    </p>
                  </div>
                </div>

                {!isLogedUser(user.id) && (<button
                  onClick={() => {
                    setShowAlert(true);
                    setDeteleUser(user)
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition"
                  title="Eliminar usuario"
                >
                  <Trash size={16} />
                </button>)}
              </div>
            ))}
          </div>
        </div>

        {/* Sección de chat */}
        <div className="flex-1 flex flex-col overflow-hidden p-3 bg-gray-900 min-h-80 max-h-80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center text-sm">
              <MessageSquare className="mr-2" size={18} />
              Chat {readyState === 1 ? '(Conectado)' : '(Conectando...)'}
            </h2>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto mb-2 pr-1 max-h-74">
            {messages.map((message) => {
              const messageUserId = String(message.userId);
              const currentUserId = String(userId);
              const user = users?.find((u) => u.id.toString() === message.userId);
              //console.log(message)
              //console.log(userId)
              //console.log(user)
              const isCurrentUser = messageUserId === currentUserId;
              //console.log(isCurrentUser)

              return (
                <div
                  key={message.id}
                  className={`mb-3 flex ${isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 ${isCurrentUser
                      ? "bg-blue-800 text-gray-300 rounded-br-none"
                      : "bg-gray-700 text-gray-300 rounded-bl-none"
                      }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-bold mb-1 text-white">
                        {user?.name || "Usuario"}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    {/* <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p> */}
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          {/* Input de mensaje */}
          <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden min-h-9 max-h-9">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // mejor usar onKeyDown, no onKeyPress (ya está deprecado)
              placeholder="Escribe un mensaje..."
              className="flex-1 py-2 px-3 focus:outline-none text-sm text-gray-900"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white h-full aspect-square flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Añadir usuario al proyecto</h2>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce el email"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => searchUser(email)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setFoundUser(null);
                  setEmail('');
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>

            {foundUser && (
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <p className="text-sm mb-2">
                  <span className="font-semibold">Nombre:</span> {foundUser.name}
                </p>
                {isLoading ? (
                  <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddUser}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                  >
                    Añadir al proyecto
                  </button>
                )}

              </div>
            )}

            {error !== '' && (
              <p className="text-red-400 text-sm">No se encontró ningún usuario con ese email.</p>
            )}
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showAlert}
        onConfirm={handleConfirm}
        onCancel={() => setShowAlert(false)}
        message="¿Estás seguro que deseas eliminar al usuario del proyecto?"
      />
    </div>
  );
};

export default ChatPanel;