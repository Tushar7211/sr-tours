import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import Landing from './pages/Landing.jsx';

// The admin is loaded only when someone opens /admin, so visitors never download it.
const Admin = lazy(() => import('./pages/Admin.jsx'));
const isAdmin = /^\/admin\/?$/i.test(window.location.pathname);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="splash">Loading…</div>}>
        <Admin />
      </Suspense>
    ) : (
      <Landing />
    )}
  </StrictMode>,
);
