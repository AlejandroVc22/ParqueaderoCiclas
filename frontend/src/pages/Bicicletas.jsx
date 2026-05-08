import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
} from 'react-icons/fi';

import {
  listBicicletas,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta,
} from '../api/bicicletas.api.js';
import Modal from '../components/ui/Modal.jsx';
import Badge from '../components/ui/Badge.jsx';
import BicicletaForm from '../components/ui/BicicletaForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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

const Bicicletas = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listBicicletas({
        estado: estado || undefined,
        search: search || undefined,
      });
      setItems(data.data || []);
    } catch (error) {
      toast.error('No se pudieron cargar las bicicletas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => items, [items]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (b) => {
    setEditing(b);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (editing) {
        await updateBicicleta(editing.id, form);
        toast.success('Bicicleta actualizada');
      } else {
        await createBicicleta(form);
        toast.success('Bicicleta registrada');
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'No se pudo guardar';
      toast.error(msg);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBicicleta(deleteTarget.id);
      toast.success('Bicicleta eliminada');
      setDeleteTarget(null);
      load();
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo eliminar';
      toast.error(msg);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Bicicletas</h1>
          <p className="muted">Administra el ingreso, salida y estado de cada bicicleta.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={load} disabled={loading}>
            <FiRefreshCw /> Refrescar
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={handleCreate}>
              <FiPlus /> Nueva bicicleta
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <form className="filters-bar" onSubmit={handleSearchSubmit}>
          <div className="search-input">
            <FiSearch />
            <input
              type="text"
              placeholder="Buscar por propietario, documento, tipo o color..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PARQUEADA">Parqueada</option>
            <option value="RETIRADA">Retirada</option>
          </select>
          <button className="btn btn-secondary" type="submit">Filtrar</button>
        </form>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Propietario</th>
                <th>Tipo</th>
                <th>Color</th>
                <th>Ingreso</th>
                <th>Salida</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="empty-row">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="empty-row">Sin resultados.</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>
                      <div className="cell-strong">{b.propietario}</div>
                      <div className="cell-muted">{b.documento}</div>
                    </td>
                    <td>{b.tipo_bicicleta}</td>
                    <td>{b.color}</td>
                    <td>{formatDate(b.hora_ingreso)}</td>
                    <td>{formatDate(b.hora_salida)}</td>
                    <td>
                      <Badge variant={b.estado === 'PARQUEADA' ? 'success' : 'warning'}>
                        {b.estado}
                      </Badge>
                    </td>
                    <td className="text-right">
                      {isAdmin && (
                        <>
                          <button
                            className="icon-btn"
                            title="Editar"
                            onClick={() => handleEdit(b)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Eliminar"
                            onClick={() => setDeleteTarget(b)}
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                      {!isAdmin && <span className="muted">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Editar bicicleta' : 'Registrar bicicleta'}
        size="lg"
      >
        <BicicletaForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
          submitLabel={editing ? 'Actualizar' : 'Registrar'}
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar bicicleta"
      >
        <p>
          ¿Seguro que deseas eliminar la bicicleta de{' '}
          <strong>{deleteTarget?.propietario}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={confirmDelete}>
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Bicicletas;
