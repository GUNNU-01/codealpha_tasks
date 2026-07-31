import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RoomProvider } from './context/RoomContext';
import { MediaProvider } from './context/MediaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode> <RoomProvider> <MediaProvider> <App /> </MediaProvider> </RoomProvider>
</React.StrictMode>
);
