import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { useState } from 'react';

const Layout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="app-main">
        <Navbar onToggleSidebar={() => setOpen((v) => !v)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
