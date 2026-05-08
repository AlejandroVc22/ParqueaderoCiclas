const StatCard = ({ title, value, icon, accent = 'cyan', subtitle }) => (
  <div className={`stat-card stat-${accent}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  </div>
);

export default StatCard;
