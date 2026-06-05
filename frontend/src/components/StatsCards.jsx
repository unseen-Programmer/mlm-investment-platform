const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const StatsCards = ({ stats }) => {
  const todayROI = stats.recentROI?.at(-1)?.roiAmount || 0;
  const items = [
    { label: 'Total Investments', value: currency.format(stats.totalInvestment || 0) },
    { label: 'Daily ROI', value: currency.format(todayROI) },
    { label: 'Level Income', value: currency.format(stats.totalLevelIncome || 0) },
    { label: 'Wallet Balance', value: currency.format(stats.walletBalance || 0) }
  ];

  return (
    <section className="stats-grid">
      {items.map((item) => (
        <article className="stat-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
};

export default StatsCards;
