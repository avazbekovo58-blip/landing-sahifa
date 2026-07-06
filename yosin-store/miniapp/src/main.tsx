import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { StoreProvider } from './lib/store';
import { initTelegram } from './lib/telegram';

// Set up the Telegram Mini App chrome (no-op in a normal browser).
initTelegram();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter keeps deep links working when served as static files from any path. */}
    <HashRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </HashRouter>
  </StrictMode>,
);
