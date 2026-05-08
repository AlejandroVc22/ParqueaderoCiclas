import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register({
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        rol: 'USER',
      });
      toast.success('Cuenta creada exitosamente');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo registrar';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <div className="auth-aside-content">
          <div className="auth-logo">🚲</div>
          <h1>Crea tu cuenta</h1>
          <p>
            Únete a Ciclo-Parqueadero y comienza a administrar tu flota de bicicletas con
            herramientas modernas y seguras.
          </p>
          <ul className="auth-features">
            <li>✓ Registro gratis</li>
            <li>✓ Acceso inmediato a tu panel</li>
            <li>✓ Datos protegidos con JWT y bcrypt</li>
          </ul>
        </div>
      </div>

      <div className="auth-card-wrapper">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Crear cuenta</h2>
          <p className="auth-subtitle">Completa el formulario para registrarte.</p>

          <div className="form-field">
            <label>Nombre completo</label>
            <div className="input-icon">
              <FiUser />
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Correo electrónico</label>
            <div className="input-icon">
              <FiMail />
              <input
                type="email"
                name="correo"
                placeholder="ejemplo@correo.com"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Contraseña</label>
              <div className="input-icon">
                <FiLock />
                <input
                  type="password"
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label>Confirmar</label>
              <div className="input-icon">
                <FiLock />
                <input
                  type="password"
                  name="confirm"
                  placeholder="Repite la contraseña"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            <FiUserPlus /> {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
