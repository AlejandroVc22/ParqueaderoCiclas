import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiRefreshCw } from 'react-icons/fi';
import { usersListRequest } from '../api/auth.api.js';
import Badge from '../components/ui/Badge.jsx';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('es-CO');
  } catch (_) {
    return value;
  }
};

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await usersListRequest();
      setUsers(data.data || []);
    } catch (error) {
      toast.error('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p className="muted">Cuentas registradas en el sistema.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={load} disabled={loading}>
            <FiRefreshCw /> Refrescar
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Registrado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="empty-row">Cargando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="empty-row">Sin usuarios.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="cell-strong">{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <Badge variant={u.rol === 'ADMIN' ? 'info' : 'default'}>
                        {u.rol}
                      </Badge>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
