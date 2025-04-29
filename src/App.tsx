import React from 'react';
import Router from './Router.tsx'
import { AppProvider} from './contexts/AppContext.tsx';
import { WebSocketProvider } from './contexts/WebSocketContext.tsx';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937', // gris oscuro (tailwind: gray-800)
            color: '#fff',
          },
        }}
      />
      <div className="App">
        <AppProvider>
          <WebSocketProvider>
            <Router />
          </WebSocketProvider>
        </AppProvider>
      </div>
    </>
  );
};

export default App;
