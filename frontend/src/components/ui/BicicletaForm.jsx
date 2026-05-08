import { useEffect, useState } from 'react';

const empty = {
  propietario: '',
  documento: '',
  tipo_bicicleta: '',
  color: '',
  estado: 'PARQUEADA',
  observaciones: '',
};

const TIPOS = ['Urbana', 'Montaña', 'BMX', 'Ruta', 'Eléctrica', 'Plegable', 'Otra'];

const BicicletaForm = ({ initial, onSubmit, onCancel, submitLabel = 'Guardar' }) => {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        propietario: initial.propietario || '',
        documento: initial.documento || '',
        tipo_bicicleta: initial.tipo_bicicleta || '',
        color: initial.color || '',
        estado: initial.estado || 'PARQUEADA',
        observaciones: initial.observaciones || '',
      });
    } else {
      setForm(empty);
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label>Propietario</label>
          <input
            type="text"
            name="propietario"
            value={form.propietario}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />
        </div>
        <div className="form-field">
          <label>Documento</label>
          <input
            type="text"
            name="documento"
            value={form.documento}
            onChange={handleChange}
            placeholder="CC, TI, CE..."
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Tipo de bicicleta</label>
          <select
            name="tipo_bicicleta"
            value={form.tipo_bicicleta}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="Ej: Rojo, Negro mate..."
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="PARQUEADA">PARQUEADA</option>
            <option value="RETIRADA">RETIRADA</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label>Observaciones</label>
        <textarea
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          rows={3}
          placeholder="Detalles adicionales (opcional)"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BicicletaForm;
