import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn mobile-only" onClick={onToggleSidebar} aria-label="Abrir menú">
          <FiMenu />
        </button>
        <div>
          <h2 className="navbar-title">Bienvenido, {user?.nombre || 'Usuario'}</h2>
          <p className="navbar-subtitle">Gestiona tu ciclo-parqueadero de forma simple y rápida</p>
        </div>
      </div>
      <div className="navbar-right">
        <button className="icon-btn" aria-label="Notificaciones">
          <FiBell />
        </button>
        <div className="role-badge" data-role={user?.rol}>
          {user?.rol}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
