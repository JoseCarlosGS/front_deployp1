import { createContext, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket';
import { useAppContext } from './AppContext';

interface IWebSocketContext {
  sendMessage: SendMessage;
  lastChatMessage: any;
  onlineUsers: any[];
  messageHistory: any[];
  readyState: ReadyState;
  onEditorUpdate?: (callback: (update: any) => void) => void;
}

const WebSocketContext = createContext<IWebSocketContext | null>(null);

import { ReactNode } from 'react';

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { editor } = useAppContext();
  const [userId] = useState(() => sessionStorage.getItem('user_id'));
  const [userEmail] = useState(() => sessionStorage.getItem('user_email'));

  const [lastChatMessage, setLastChatMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const editorUpdateCallback = useRef<((update: any) => void) | null>(null);
  const [initialSyncReceived, setInitialSyncReceived] = useState(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    userId && userEmail
      ? `wss://back-deployp1.onrender.com/api/socket/ws/${userId}/${userEmail}`
      : null,
    {
      onOpen: () => console.log('WebSocket conectado'),
      onError: (event) => console.error('Error en WebSocket:', event),
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );
  type IncomingMessage = {
    type: 'users' | 'message' | 'history' | 'editor-update' | 'editor-state';
    data: any;
  };

  useEffect(() => {
    console.log(lastMessage)
    if (lastMessage !== null) {
      try {
        const data: IncomingMessage = JSON.parse(lastMessage.data);
        console.log("Mensaje recibido:", data);

        if (data.type === 'users') {
          setOnlineUsers(data.data); // 👈 usuarios conectados
        }
        else if (data.type === 'message') {
          setLastChatMessage(data.data); // 👈 último mensaje
        }
        else if (data.type === 'history') {
          setMessageHistory(data.data); // 👈 historial de mensajes
        }
        else if (data.type === 'editor-state') {
          // Estado inicial del editor
          if (!initialSyncReceived && editor) {
            setInitialSyncReceived(true);
            applyEditorState(data.data);
          }
        }
        else if (data.type === 'editor-update') {
          handleEditorUpdate(data.data);  // <<< nueva función que debes crear
        }

      } catch (error) {
        console.error('Error al parsear mensaje:', error);
      }
    }
  }, [lastMessage]);

  const applyEditorState = (state: any) => {
    if (!editor || !state) return;

    try {
      // Limpiar el editor actual
      while (editor.Pages!.getAll().length > 0) {
        editor.Pages!.remove(editor.Pages!.getAll()[0]);
      }

      // Añadir las páginas recibidas
      if (state.pages && Array.isArray(state.pages)) {
        state.pages.forEach((page: any) => {
          editor.Pages!.add({
            id: page.id,
            name: page.name,
            component: page.component
          });
        });

        // Seleccionar la página activa
        if (typeof state.activePageIndex === 'number' && state.activePageIndex >= 0) {
          const pages = editor.Pages!.getAll();
          if (pages[state.activePageIndex]) {
            editor.Pages!.select(pages[state.activePageIndex]);
          }
        }
      }
    } catch (error) {
      console.error("Error al aplicar estado inicial del editor:", error);
    }
  };

  const handleEditorUpdate = (update: any) => {
    if (!editor) return;

    if (editorUpdateCallback.current) {
      editorUpdateCallback.current(update);
      return; // 🔥 Aquí ya delegas al que lo haya registrado
    }

    // Si no hay ningún callback registrado, aplica normal (por seguridad)
    if (update.action === 'add') {
      console.log('Recibiendo nuevo componente para añadir:', update.component);
      editor.addComponents(update.component);
    }
  };

  const onEditorUpdate = (callback: (update: any) => void) => {
    editorUpdateCallback.current = callback;
  };

  return (
    <WebSocketContext.Provider value={{
      sendMessage,
      lastChatMessage,
      onlineUsers,
      messageHistory,
      readyState,
      onEditorUpdate,
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};
