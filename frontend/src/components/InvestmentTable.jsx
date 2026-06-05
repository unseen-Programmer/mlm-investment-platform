const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));

const InvestmentTable = ({ investments = [] }) => {
  if (investments.length === 0) {
    return <p className="empty-state">No investments yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <tr key={investment._id}>
              <td>{investment.plan}</td>
              <td>{currency.format(investment.amount)}</td>
              <td>{formatDate(investment.startDate)}</td>
              <td>{formatDate(investment.endDate)}</td>
              <td>
                <span className={`status ${investment.status.toLowerCase()}`}>
                  {investment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentTable;
