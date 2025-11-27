import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsAPI, scenariosAPI } from '../services/api';
import '../styles/Dashboard.css';

const COLORS = ['#FBD6E3', '#A9EDE9', '#F39C12', '#E74C3C', '#27AE60'];

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [fraudStats, setFraudStats] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch analytics
      const analyticsResponse = await analyticsAPI.getDashboard();
      setSummary(analyticsResponse.data.summary);
      setAnalytics(analyticsResponse.data.analytics);

      // Fetch fraud stats
      const fraudResponse = await analyticsAPI.getFraudStats();
      setFraudStats(fraudResponse.data);

      // Fetch scenarios
      const scenariosResponse = await scenariosAPI.getAll();
      setScenarios(scenariosResponse.data);
    } catch (error) {
      console.error('Fetch Data Error:', error);
      alert('Không thể tải dữ liệu dashboard. Vui lòng kiểm tra kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  // Prepare chart data
  const dailyData = analytics.map((day) => ({
    date: new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    'Hội thoại': day.metrics.totalConversations,
    'Tin nhắn': day.metrics.totalMessages,
    'Cảnh báo': day.metrics.fraudWarnings,
  }));

  const platformData = summary
    ? [
        { name: 'Mobile', value: summary.platformDistribution.mobile },
        { name: 'Web', value: summary.platformDistribution.web },
      ]
    : [];

  const languageData = summary
    ? [
        { name: 'Tiếng Việt', value: summary.languageDistribution.vi },
        { name: 'English', value: summary.languageDistribution.en },
        { name: 'ភាសាខ្មែរ', value: summary.languageDistribution.km },
      ]
    : [];

  const categoryData = summary
    ? Object.entries(summary.topCategories).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard Quản Trị</h1>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Tổng Hội Thoại</h3>
            <p className="stat-number">{summary?.totalConversations || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Tổng Tin Nhắn</h3>
            <p className="stat-number">{summary?.totalMessages || 0}</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>Cảnh Báo Lừa Đảo</h3>
            <p className="stat-number">{summary?.totalFraudWarnings || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>TB Tin Nhắn/Ngày</h3>
            <p className="stat-number">{summary?.averageMessagesPerDay || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Daily Activity */}
        <div className="chart-card full-width">
          <h3>📈 Hoạt Động Theo Ngày (30 ngày gần nhất)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Hội thoại" stroke="#FBD6E3" strokeWidth={2} />
              <Line type="monotone" dataKey="Tin nhắn" stroke="#A9EDE9" strokeWidth={2} />
              <Line type="monotone" dataKey="Cảnh báo" stroke="#E74C3C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="chart-card">
          <h3>📱 Phân Bố Nền Tảng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Language Distribution */}
        <div className="chart-card">
          <h3>🌐 Phân Bố Ngôn Ngữ</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-card full-width">
          <h3>🎯 Phân Loại Lừa Đảo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#FBD6E3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="scenarios-section">
        <h3>📚 Kịch Bản Q&A ({scenarios.length} scenarios)</h3>
        <div className="scenarios-table">
          <table>
            <thead>
              <tr>
                <th>Loại</th>
                <th>Ngôn ngữ</th>
                <th>Câu hỏi</th>
                <th>Mức độ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.slice(0, 10).map((scenario) => (
                <tr key={scenario._id}>
                  <td>{scenario.category}</td>
                  <td>{scenario.language.toUpperCase()}</td>
                  <td className="scenario-question">{scenario.question}</td>
                  <td>
                    <span className={`risk-badge ${scenario.riskLevel}`}>
                      {scenario.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span className={scenario.isActive ? 'active-badge' : 'inactive-badge'}>
                      {scenario.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
