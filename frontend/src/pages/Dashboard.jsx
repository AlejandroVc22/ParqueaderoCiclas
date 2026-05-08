import { useEffect, useState } from 'react';
import { FiTruck, FiCheckCircle, FiArchive, FiUsers } from 'react-icons/fi';
import StatCard from '../components/ui/StatCard.jsx';
import { getBicicletasStats, listBicicletas } from '../api/bicicletas.api.js';
import { usersCountRequest } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Badge from '../components/ui/Badge.jsx';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return value;
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, parqueadas: 0, retiradas: 0 });
  const [usersCount, setUsersCount] = useState(0);
  const [recentes, setRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statsRes, listRes, usersRes] = await Promise.all([
          getBicicletasStats(),
          listBicicletas(),
          usersCountRequest().catch(() => ({ data: { data: { total: 0 } } })),
        ]);
        setStats(statsRes.data.data);
        setRecentes((listRes.data.data || []).slice(0, 5));
        setUsersCount(usersRes.data?.data?.total || 0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Resumen general del ciclo-parqueadero</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Bicicletas"
          value={loading ? '—' : stats.total}
          icon={<FiTruck />}
          accent="cyan"
          subtitle="Registradas en el sistema"
        />
        <StatCard
          title="Parqueadas"
          value={loading ? '—' : stats.parqueadas}
          icon={<FiCheckCircle />}
          accent="green"
          subtitle="Actualmente en el parqueadero"
        />
        <StatCard
          title="Retiradas"
          value={loading ? '—' : stats.retiradas}
          icon={<FiArchive />}
          accent="orange"
          subtitle="Ya salieron del parqueadero"
        />
        <StatCard
          title="Usuarios"
          value={loading ? '—' : usersCount}
          icon={<FiUsers />}
          accent="purple"
          subtitle="Cuentas registradas"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Bicicletas recientes</h3>
            <p className="muted">Últimos ingresos al ciclo-parqueadero</p>
          </div>
          <Badge variant="info">Hola, {user?.nombre?.split(' ')[0]}</Badge>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Propietario</th>
                <th>Tipo</th>
                <th>Color</th>
                <th>Ingreso</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-row">Cargando...</td>
                </tr>
              ) : recentes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    Aún no hay bicicletas registradas. Ve a la sección "Bicicletas" para
                    crear la primera.
                  </td>
                </tr>
              ) : (
                recentes.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="cell-strong">{b.propietario}</div>
                      <div className="cell-muted">{b.documento}</div>
                    </td>
                    <td>{b.tipo_bicicleta}</td>
                    <td>{b.color}</td>
                    <td>{formatDate(b.hora_ingreso)}</td>
                    <td>
                      <Badge variant={b.estado === 'PARQUEADA' ? 'success' : 'warning'}>
                        {b.estado}
                      </Badge>
                    </td>
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

export default Dashboard;
