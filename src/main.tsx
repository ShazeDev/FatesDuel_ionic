import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MusicProvider } from './MusicContext'; 

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <MusicProvider> 
    <App />
    </MusicProvider> 
  </React.StrictMode>
);