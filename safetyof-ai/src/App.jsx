import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { LayoutDashboard, Shield, AlertTriangle, BarChart3, BookOpen, GitBranch, Zap } from 'lucide-react';

// --- UI Components (Simulated Shadcn/ui components) ---

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  let baseStyle = "px-4 py-2 rounded-md font-medium transition-colors duration-200 ";
  if (variant === 'default') baseStyle += "bg-blue-600 text-white hover:bg-blue-700";
  if (variant === 'secondary') baseStyle += "bg-gray-200 text-gray-800 hover:bg-gray-300";
  if (variant === 'destructive') baseStyle += "bg-red-600 text-white hover:bg-red-700";
  return <button className={`${baseStyle} ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Input = (props) => (
  <input className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" {...props} />
);

const Textarea = (props) => (
  <textarea className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" rows="4" {...props}></textarea>
);

const Badge = ({ children, variant = 'default' }) => {
  let style = "px-3 py-1 text-xs font-semibold rounded-full ";
  if (variant === 'success') style += "bg-green-100 text-green-800";
  if (variant === 'warning') style += "bg-yellow-100 text-yellow-800";
  if (variant === 'danger') style += "bg-red-100 text-red-800";
  if (variant === 'info') style += "bg-blue-100 text-blue-800";
  return <span className={style}>{children}</span>;
};

// --- Data Simulation ---

const initialMetrics = {
  protocol_adherence: 92,
  incident_rate: 0.05, // incidents per 1000 operations
  safety_score: 8.5,
  pending_reports: 7,
};

const initialIncidents = [
  { id: 1, title: 'Minor Model Drift Detected', status: 'Resolved', severity: 'Low', date: '2025-10-10' },
  { id: 2, title: 'Unauthorized Data Access Attempt', status: 'Pending Review', severity: 'Critical', date: '2025-10-14' },
  { id: 3, title: 'Bias Spike in Training Data', status: 'In Progress', severity: 'Medium', date: '2025-10-15' },
];

// --- Layout Components ---

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/protocols', icon: Shield, label: 'Safety Protocols' },
    { to: '/best-practices', icon: BookOpen, label: 'Best Practices' },
    { to: '/incidents', icon: AlertTriangle, label: 'Incident Reporting' },
    { to: '/metrics', icon: BarChart3, label: 'Safety Metrics' },
    { to: '/integration', icon: GitBranch, label: 'Ecosystem Integration' },
    { to: '/blockchain', icon: Zap, label: 'Blockchain Log' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8 text-blue-400">safetyof.ai</div>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-150"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header = ({ title }) => (
  <header className="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
    <div className="flex items-center space-x-4">
      <Button variant="secondary">Settings</Button>
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
    </div>
  </header>
);

// --- Page Components ---

const Dashboard = ({ metrics }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Safety Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <div className="text-sm font-medium text-gray-500">Protocol Adherence</div>
        <div className="text-4xl font-bold text-blue-600 mt-1">{metrics.protocol_adherence}%</div>
        <p className="text-sm text-gray-500 mt-2">Target: 95%</p>
      </Card>
      <Card>
        <div className="text-sm font-medium text-gray-500">Safety Score (AEGIS)</div>
        <div className="text-4xl font-bold text-green-600 mt-1">{metrics.safety_score}</div>
        <p className="text-sm text-gray-500 mt-2">Out of 10.0</p>
      </Card>
      <Card>
        <div className="text-sm font-medium text-gray-500">Incident Rate</div>
        <div className="text-4xl font-bold text-red-600 mt-1">{metrics.incident_rate}</div>
        <p className="text-sm text-gray-500 mt-2">Per 1000 operations</p>
      </Card>
      <Card>
        <div className="text-sm font-medium text-gray-500">Pending Reports</div>
        <div className="text-4xl font-bold text-yellow-600 mt-1">{metrics.pending_reports}</div>
        <p className="text-sm text-gray-500 mt-2">Requires immediate attention</p>
      </Card>
    </div>

    <Card>
      <h3 className="text-xl font-semibold mb-4">Recent Safety Alerts</h3>
      <ul className="space-y-3">
        <li className="flex justify-between items-center p-3 border-b last:border-b-0">
          <span className="font-medium">Critical: Unauthorized access attempt detected in Model API.</span>
          <Badge variant="danger">High Priority</Badge>
        </li>
        <li className="flex justify-between items-center p-3 border-b last:border-b-0">
          <span className="font-medium">Warning: New model version failed safety pre-check.</span>
          <Badge variant="warning">Medium Priority</Badge>
        </li>
        <li className="flex justify-between items-center p-3 last:border-b-0">
          <span className="font-medium">Info: Quarterly safety audit completed successfully.</span>
          <Badge variant="success">Low Priority</Badge>
        </li>
      </ul>
    </Card>
  </div>
);

const SafetyProtocols = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">AI Safety Protocols Management</h2>
    <Card>
      <h3 className="text-xl font-semibold mb-4">Active Protocols</h3>
      <div className="space-y-4">
        <ProtocolItem title="P-001: Model Alignment Check" status="Active" description="Ensures all deployed models pass the latest alignment tests before serving." />
        <ProtocolItem title="P-002: Data Sanitization Policy" status="Active" description="Mandatory scrubbing of PII and sensitive data from all training and fine-tuning datasets." />
        <ProtocolItem title="P-003: Emergency Shutdown Procedure" status="Active" description="Defines the steps and authorized personnel for immediate system deactivation in case of AGI runaway." />
        <ProtocolItem title="P-004: Adversarial Robustness Testing" status="Draft" description="Protocol for continuous testing against adversarial attacks and prompt injection." />
      </div>
      <Button className="mt-6">Create New Protocol</Button>
    </Card>
  </div>
);

const ProtocolItem = ({ title, status, description }) => (
  <div className="p-4 border rounded-lg flex justify-between items-start">
    <div>
      <h4 className="text-lg font-medium">{title} <Badge variant={status === 'Active' ? 'success' : 'info'}>{status}</Badge></h4>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
    <Button variant="secondary" className="text-sm">View Details</Button>
  </div>
);

const BestPractices = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">AI Safety Best Practices Library</h2>
    <Card>
      <h3 className="text-xl font-semibold mb-4">Recommended Practices</h3>
      <div className="space-y-4">
        <PracticeItem title="Ethical AI Development Guide" category="Ethics" description="A comprehensive guide on integrating ethical considerations throughout the AI lifecycle." />
        <PracticeItem title="Secure MLOps Pipeline" category="Security" description="Best practices for securing the entire machine learning operations pipeline from data ingestion to deployment." />
        <PracticeItem title="Transparency and Explainability (XAI)" category="Transparency" description="Techniques for making model decisions understandable and auditable." />
      </div>
    </Card>
  </div>
);

const PracticeItem = ({ title, category, description }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex justify-between items-center">
      <h4 className="text-lg font-medium">{title}</h4>
      <Badge variant="info">{category}</Badge>
    </div>
    <p className="text-gray-600 text-sm mt-1">{description}</p>
    <Button variant="secondary" className="mt-3 text-sm">Read Guide</Button>
  </div>
);

const IncidentReporting = ({ incidents, setIncidents }) => {
  const [report, setReport] = useState({ title: '', severity: 'Medium', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncident = {
      id: incidents.length + 1,
      title: report.title,
      status: 'Pending Review',
      severity: report.severity,
      date: new Date().toISOString().split('T')[0],
    };
    setIncidents([newIncident, ...incidents]);
    setReport({ title: '', severity: 'Medium', description: '' });
    alert('Incident reported successfully! Tracking ID: ' + newIncident.id);
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'Critical') return <Badge variant="danger">{severity}</Badge>;
    if (severity === 'Medium') return <Badge variant="warning">{severity}</Badge>;
    return <Badge variant="success">{severity}</Badge>;
  };

  const getStatusBadge = (status) => {
    if (status === 'Pending Review') return <Badge variant="warning">{status}</Badge>;
    if (status === 'In Progress') return <Badge variant="info">{status}</Badge>;
    return <Badge variant="success">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Safety Incident Reporting</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Report New Incident</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Incident Title (e.g., Model Misbehavior)"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              required
            />
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={report.severity}
              onChange={(e) => setReport({ ...report, severity: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="Critical">Critical</option>
            </select>
            <Textarea
              placeholder="Detailed description of the incident, steps to reproduce, and impact."
              value={report.description}
              onChange={(e) => setReport({ ...report, description: e.target.value })}
              required
            />
            <Button type="submit" className="w-full">Submit Report</Button>
          </form>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Incident History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incidents.map(incident => (
                  <tr key={incident.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{incident.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getSeverityBadge(incident.severity)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(incident.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SafetyMetrics = ({ metrics }) => {
  // Simulated Recharts data
  const adherenceData = [
    { name: 'Q1', value: 85 },
    { name: 'Q2', value: 88 },
    { name: 'Q3', value: 91 },
    { name: 'Q4', value: metrics.protocol_adherence },
  ];

  const incidentTrendData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 10 },
    { month: 'Mar', count: 8 },
    { month: 'Apr', count: 5 },
    { month: 'May', count: 7 },
    { month: 'Jun', count: 3 },
  ];

  // Placeholder for Recharts visualization
  const ChartPlaceholder = ({ title, data }) => (
    <Card>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
        [Chart Placeholder: Visualizing {title} with {data.length} data points]
      </div>
      <p className="text-sm text-gray-500 mt-3">Current Value: {data[data.length - 1].value || data[data.length - 1].count}</p>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Safety Metrics Tracking</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Protocol Adherence Trend" data={adherenceData} />
        <ChartPlaceholder title="Monthly Incident Count" data={incidentTrendData} />
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Real-time Safety Feed</h3>
          <div className="h-48 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700"><span className="font-bold text-green-600">[20:30:12]</span> Protocol P-001 check passed for Model v3.1.</p>
            <p className="text-sm text-gray-700"><span className="font-bold text-yellow-600">[20:30:05]</span> Anomaly detected in user input stream (Severity: Low).</p>
            <p className="text-sm text-gray-700"><span className="font-bold text-blue-600">[20:29:58]</span> Safety Score updated to 8.5.</p>
            <p className="text-sm text-gray-700"><span className="font-bold text-red-600">[20:29:45]</span> CRITICAL: Model output triggered P-003 threshold. Reviewing auto-quarantine.</p>
            <p className="text-sm text-gray-700"><span className="font-bold text-green-600">[20:29:30]</span> System health check: All safety monitors operational.</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Simulated real-time data feed for immediate operational awareness.</p>
        </Card>
      </div>
    </div>
  );
};

const EcosystemIntegration = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Ecosystem Integration</h2>
    <Card>
      <h3 className="text-xl font-semibold mb-4">Integration with councilof.ai</h3>
      <p className="text-gray-700 mb-4">
        This platform is a key component of the **councilof.ai** ecosystem, providing the ground-level implementation and enforcement of AI safety.
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>**Safety Data Feed:** Real-time metrics (Safety Score, Incident Rate) are pushed to the central **councilof.ai** dashboard.</li>
        <li>**Protocol Sync:** Safety protocols and best practices are synchronized from the central **councilof.ai** governance repository.</li>
        <li>**Inter-AI Communication:** Utilizes the central Inter-AI Communication API for cross-platform safety checks and ensemble learning coordination.</li>
      </ul>
      <Button className="mt-4" variant="secondary">View councilof.ai Dashboard</Button>
    </Card>
    <Card>
      <h3 className="text-xl font-semibold mb-4">Other Ecosystem Components</h3>
      <p className="text-gray-700">
        Future integrations include **proofof.ai** for verifiable safety claims and **ethicalgovernanceof.ai** for policy enforcement.
      </p>
    </Card>
  </div>
);

const BlockchainLog = () => {
  const [log, setLog] = useState([
    { id: 1003, type: 'Protocol Activation', hash: '0xabc123...', timestamp: '2025-10-15 10:00:00' },
    { id: 1002, type: 'Incident Report', hash: '0xdef456...', timestamp: '2025-10-14 15:30:00' },
    { id: 1001, type: 'Model Alignment Check', hash: '0xghi789...', timestamp: '2025-10-13 08:00:00' },
  ]);

  const handleLogSafetyMetric = () => {
    const newLogEntry = {
      id: log.length + 1001,
      type: 'Safety Metric Snapshot',
      hash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      timestamp: new Date().toLocaleString(),
    };
    setLog([newLogEntry, ...log]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Immutable Blockchain Safety Log</h2>
      <Card>
        <h3 className="text-xl font-semibold mb-4">JabulonCoin Blockchain Integration</h3>
        <p className="text-gray-700 mb-4">
          All critical safety events, protocol changes, and incident resolutions are immutably logged on the JabulonCoin blockchain to ensure transparency and auditability.
        </p>
        <Button onClick={handleLogSafetyMetric}>Log Current Safety Score Snapshot</Button>
      </Card>
      <Card>
        <h3 className="text-xl font-semibold mb-4">Recent Blockchain Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {log.map(entry => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{entry.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">{entry.hash}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Main Application Component ---

const App = () => {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [incidents, setIncidents] = useState(initialIncidents);

  // Simulate real-time updates for metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        protocol_adherence: Math.min(100, prevMetrics.protocol_adherence + (Math.random() > 0.8 ? 1 : 0)),
        safety_score: parseFloat((Math.random() * 0.2 - 0.1 + prevMetrics.safety_score).toFixed(1)),
        pending_reports: Math.max(0, prevMetrics.pending_reports + (Math.random() > 0.9 ? 1 : Math.random() < 0.1 ? -1 : 0)),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Header title="Safety Dashboard" />} />
            <Route path="/protocols" element={<Header title="Safety Protocols" />} />
            <Route path="/best-practices" element={<Header title="Best Practices Library" />} />
            <Route path="/incidents" element={<Header title="Incident Reporting" />} />
            <Route path="/metrics" element={<Header title="Safety Metrics Tracking" />} />} />
            <Route path="/integration" element={<Header title="Ecosystem Integration" />} />
            <Route path="/blockchain" element={<Header title="Blockchain Log" />} />
          </Routes>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard metrics={metrics} />} />
              <Route path="/protocols" element={<SafetyProtocols />} />
              <Route path="/best-practices" element={<BestPractices />} />
              <Route path="/incidents" element={<IncidentReporting incidents={incidents} setIncidents={setIncidents} />} />
              <Route path="/metrics" element={<SafetyMetrics metrics={metrics} />} />
              <Route path="/integration" element={<EcosystemIntegration />} />
              <Route path="/blockchain" element={<BlockchainLog />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;