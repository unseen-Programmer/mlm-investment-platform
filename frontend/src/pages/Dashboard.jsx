import { useCallback, useEffect, useState } from 'react';
import api from '../api/api';
import InvestmentTable from '../components/InvestmentTable';
import ReferralTree from '../components/ReferralTree';
import ROIChart from '../components/ROIChart';
import StatsCards from '../components/StatsCards';

const initialInvestment = {
  amount: '',
  plan: 'Silver'
};

const Dashboard = ({ user, onLogout }) => {
  const [dashboard, setDashboard] = useState(null);
  const [tree, setTree] = useState(null);
  const [investment, setInvestment] = useState(initialInvestment);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadDashboard = useCallback(async () => {
    setError('');
    try {
      const [dashboardResponse, treeResponse] = await Promise.all([
        api.get('/dashboard'),
        api.get('/referrals/tree')
      ]);
      setDashboard(dashboardResponse.data);
      setTree(treeResponse.data.tree);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleInvestmentSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    try {
      await api.post('/investments', {
        amount: Number(investment.amount),
        plan: investment.plan
      });
      setNotice('Investment created successfully.');
      setInvestment(initialInvestment);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create investment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="center-state">Loading dashboard...</main>;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p>MLM Investment Platform</p>
          <h1>Dashboard</h1>
        </div>
        <div className="user-box">
          <span>{user?.name}</span>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {notice && <div className="alert success">{notice}</div>}

      <StatsCards stats={dashboard} />

      <section className="panel referral-code-panel">
        <div>
          <span>Your Referral Code</span>
          <strong>{dashboard.referralCode}</strong>
        </div>
        <p>Share this code with new members to earn Level 1, Level 2 and Level 3 income.</p>
      </section>

      <section className="grid-two">
        <article className="panel">
          <div className="panel-heading">
            <h2>Create Investment</h2>
          </div>
          <form className="investment-form" onSubmit={handleInvestmentSubmit}>
            <label>
              Amount
              <input
                min="1"
                required
                type="number"
                value={investment.amount}
                onChange={(event) =>
                  setInvestment((current) => ({ ...current, amount: event.target.value }))
                }
                placeholder="10000"
              />
            </label>
            <label>
              Plan
              <select
                value={investment.plan}
                onChange={(event) =>
                  setInvestment((current) => ({ ...current, plan: event.target.value }))
                }
              >
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
              </select>
            </label>
            <button disabled={saving} type="submit">
              {saving ? 'Creating...' : 'Create Investment'}
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>ROI Chart</h2>
          </div>
          <ROIChart data={dashboard.recentROI} />
        </article>
      </section>

      <section className="grid-two lower-grid">
        <article className="panel">
          <div className="panel-heading">
            <h2>Investment Table</h2>
          </div>
          <InvestmentTable investments={dashboard.investments} />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>Referral Tree</h2>
          </div>
          <ReferralTree tree={tree} />
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
