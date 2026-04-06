const StatCard = ({ label, value, helper, tone = "neutral" }) => {
  return (
    <article className={`stat-card ${tone}`}>
      <p className="stat-label">{label}</p>
      <h3>{value}</h3>
      <p className="muted">{helper}</p>
    </article>
  );
};

export default StatCard;
