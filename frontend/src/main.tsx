import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App, Providers } from './app/index.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
