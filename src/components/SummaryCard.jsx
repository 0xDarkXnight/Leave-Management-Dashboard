function SummaryCard({ title, value, subtitle, icon, variant = "total" }) {
  return (
    <div className={`summary-card`}>
      <div className="sc-top">
        <div className={`sc-icon ${variant}`} aria-hidden="true">
          {icon}
        </div>
        <span className="live-badge">
          <span className="live-dot" />
          Live
        </span>
      </div>

      <div className="sc-value">{value}</div>
      <div className="sc-title">{title}</div>
      {subtitle && <div className="sc-sub">{subtitle}</div>}
    </div>
  );
}

export default SummaryCard;