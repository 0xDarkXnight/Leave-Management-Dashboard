function SummaryCard({ title, value, subtitle }) {
  return (
    <div className="card summary-card">
      <p className="card-title">{title}</p>
      <h3 className="summary-value">{value}</h3>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
  );
}

export default SummaryCard;