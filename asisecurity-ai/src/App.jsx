import { useState, useEffect } from 'react'
import './App.css'
import { Shield, AlertTriangle, CheckCircle, Activity, Eye, Lock, Zap, TrendingUp } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [threats, setThreats] = useState([])
  const [stats, setStats] = useState({
    totalScans: 45782,
    threatsBlocked: 342,
    systemsMonitored: 127,
    uptime: 99.8
  })

  useEffect(() => {
    // Simulate real-time threat detection
    const interval = setInterval(() => {
      const newThreat = {
        id: Date.now(),
        type: ['Unauthorized Access', 'Data Exfiltration', 'Model Poisoning', 'Adversarial Attack'][Math.floor(Math.random() * 4)],
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        source: `AI-${Math.floor(Math.random() * 100)}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Blocked'
      }
      
      setThreats(prev => [newThreat, ...prev].slice(0, 10))
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        threatsBlocked: prev.threatsBlocked + (newThreat.severity === 'Critical' ? 1 : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      'Medium': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      'High': 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      'Critical': 'bg-red-500/20 border-red-500/50 text-red-400'
    }
    return colors[severity] || colors['Low']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">ASISecurity.ai</h1>
                <p className="text-sm text-blue-300">AI Security Monitoring Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">System Status</div>
                <div className="flex items-center gap-2 text-green-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="font-semibold">Active Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveTab('threats')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'threats'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Threats
            </div>
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'monitoring'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Monitoring
            </div>
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Total Scans</h3>
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalScans.toLocaleString()}</div>
                <p className="text-xs text-green-400 mt-1">↑ 12.5% from last hour</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Threats Blocked</h3>
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.threatsBlocked}</div>
                <p className="text-xs text-red-400 mt-1">↓ 3.2% from yesterday</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Systems Monitored</h3>
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.systemsMonitored}</div>
                <p className="text-xs text-green-400 mt-1">↑ 5 new systems</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Uptime</h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.uptime}%</div>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
            </div>

            {/* Real-time Threat Feed */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                Real-time Threat Detection
              </h2>
              
              <div className="space-y-3">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Monitoring for threats... No threats detected yet.</p>
                  </div>
                ) : (
                  threats.map(threat => (
                    <div key={threat.id} className={`p-4 rounded-lg border ${getSeverityColor(threat.severity)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5" />
                          <div>
                            <div className="font-semibold">{threat.type}</div>
                            <div className="text-xs opacity-75">Source: {threat.source} • {threat.timestamp}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/30">
                            {threat.severity}
                          </span>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-semibold">{threat.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Threats Tab */}
        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Threat Categories</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <h3 className="text-xl font-bold text-white">Unauthorized Access</h3>
                  </div>
                  <p className="text-gray-300 mb-2">Attempts to access AI systems without proper authorization</p>
                  <div className="text-2xl font-bold text-red-400">87 blocked</div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-6 rounded-lg border border-orange-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-8 h-8 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">Data Exfiltration</h3>
                  </div>
                  <p className="text-gray-300 mb-2">Unauthorized data extraction from AI models</p>
                  <div className="text-2xl font-bold text-orange-400">52 blocked</div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 p-6 rounded-lg border border-yellow-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Model Poisoning</h3>
                  </div>
                  <p className="text-gray-300 mb-2">Attempts to corrupt AI training data or models</p>
                  <div className="text-2xl font-bold text-yellow-400">34 blocked</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-lg border border-purple-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Adversarial Attacks</h3>
                  </div>
                  <p className="text-gray-300 mb-2">Crafted inputs designed to fool AI systems</p>
                  <div className="text-2xl font-bold text-purple-400">169 blocked</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Active Monitoring</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'GPT-4 Production', status: 'Secure', scans: 12847, threats: 0 },
                  { name: 'Claude API Gateway', status: 'Secure', scans: 8932, threats: 0 },
                  { name: 'Gemini Training Pipeline', status: 'Warning', scans: 5421, threats: 2 },
                  { name: 'Midjourney Generation', status: 'Secure', scans: 15632, threats: 0 },
                  { name: 'Stable Diffusion XL', status: 'Secure', scans: 9876, threats: 0 },
                ].map((system, idx) => (
                  <div key={idx} className="bg-black/30 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Eye className="w-6 h-6 text-blue-400" />
                        <div>
                          <div className="font-semibold text-white">{system.name}</div>
                          <div className="text-sm text-gray-400">
                            {system.scans.toLocaleString()} scans • {system.threats} threats
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {system.status === 'Secure' ? (
                          <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 font-semibold">
                            ✓ Secure
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 font-semibold">
                            ⚠ Warning
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
