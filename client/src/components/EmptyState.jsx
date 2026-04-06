const EmptyState = ({ title, description }) => {
  return (
    <div className="empty-state">
      <h4>{title}</h4>
      <p className="muted">{description}</p>
    </div>
  );
};

export default EmptyState;
