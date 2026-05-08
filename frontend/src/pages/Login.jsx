import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Sesión iniciada');
      const dest = location.state?.from?.pathname || '/dashboard';
      navigate(dest, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'Credenciales inválidas';
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
          <h1>Ciclo-Parqueadero</h1>
          <p>
            Plataforma profesional para administrar de forma simple, segura y elegante el
            ingreso y salida de bicicletas en tu parqueadero.
          </p>
          <ul className="auth-features">
            <li>✓ Control total de tus bicicletas</li>
            <li>✓ Roles diferenciados ADMIN / USER</li>
            <li>✓ Reportes y estadísticas en tiempo real</li>
          </ul>
        </div>
      </div>

      <div className="auth-card-wrapper">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Iniciar sesión</h2>
          <p className="auth-subtitle">Bienvenido de nuevo. Ingresa tus credenciales.</p>

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

          <div className="form-field">
            <label>Contraseña</label>
            <div className="input-icon">
              <FiLock />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            <FiLogIn /> {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="auth-footer">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>

          <div className="auth-hint">
            <strong>Admin demo:</strong> admin@cicloparqueadero.com / Admin123!
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
