import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    'sidebar-link' + (isActive ? ' active' : '');

  return (
    <>
      <aside className={'sidebar' + (mobileOpen ? ' open' : '')}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-emoji" aria-hidden>🚲</span>
            <div>
              <h1 className="brand-title">Ciclo</h1>
              <p className="brand-subtitle">Parqueadero</p>
            </div>
          </div>
          <button className="icon-btn mobile-only" onClick={onClose} aria-label="Cerrar menú">
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section">Navegación</p>
          <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
            <FiGrid /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/bicicletas" className={linkClass} onClick={onClose}>
            <FiTruck /> <span>Bicicletas</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/usuarios" className={linkClass} onClick={onClose}>
              <FiUsers /> <span>Usuarios</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.nombre}</p>
              <p className="user-role">{user?.rol}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <FiLogOut /> Cerrar sesión
          </button>
        </div>
      </aside>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  );
};

export default Sidebar;
