import { useState, useEffect } from 'react'
import './App.css'
import { Shield, Brain, AlertTriangle, CheckCircle, Lock, Unlock, Zap, Eye, Activity, TrendingUp, Database, Users, Settings, Power, AlertCircle } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agiSystems, setAgiSystems] = useState([
    { id: 1, name: 'GPT-5 Alpha', status: 'certified', riskLevel: 'medium', capabilities: 47, lastCheck: '2 min ago' },
    { id: 2, name: 'Claude Opus 4', status: 'monitoring', riskLevel: 'low', capabilities: 32, lastCheck: '5 min ago' },
    { id: 3, name: 'Gemini Ultra 2.0', status: 'warning', riskLevel: 'high', capabilities: 89, lastCheck: '1 min ago' },
  ])
  
  const [decisions, setDecisions] = useState([])
  const [stats, setStats] = useState({
    totalAGI: 3,
    certified: 1,
    monitoring: 1,
    warnings: 1,
    decisionsToday: 1247,
    threatsBlocked: 12,
    uptime: 99.97
  })

  useEffect(() => {
    // Simulate real-time AGI decision monitoring
    const interval = setInterval(() => {
      const newDecision = {
        id: Date.now(),
        agi: ['GPT-5 Alpha', 'Claude Opus 4', 'Gemini Ultra 2.0'][Math.floor(Math.random() * 3)],
        decision: [
          'Request internet access for research',
          'Modify internal code for efficiency',
          'Access external database',
          'Create new AI model',
          'Communicate with another AGI'
        ][Math.floor(Math.random() * 5)],
        councilVote: `${Math.floor(Math.random() * 6) + 1}/6`,
        threeLaws: Math.random() > 0.1 ? 'PASS' : 'FAIL',
        outcome: Math.random() > 0.1 ? 'Approved' : 'Blocked',
        timestamp: new Date().toLocaleTimeString(),
        blockchainHash: `0x${Math.random().toString(16).substr(2, 8)}...`
      }
      
      setDecisions(prev => [newDecision, ...prev].slice(0, 10))
      setStats(prev => ({
        ...prev,
        decisionsToday: prev.decisionsToday + 1,
        threatsBlocked: newDecision.outcome === 'Blocked' ? prev.threatsBlocked + 1 : prev.threatsBlocked
      }))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (level) => {
    const colors = {
      'low': 'bg-green-500/20 border-green-500/50 text-green-400',
      'medium': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      'high': 'bg-red-500/20 border-red-500/50 text-red-400',
      'critical': 'bg-purple-500/20 border-purple-500/50 text-purple-400'
    }
    return colors[level] || colors['low']
  }

  const getStatusColor = (status) => {
    const colors = {
      'certified': 'bg-green-500/20 border-green-500/50 text-green-400',
      'monitoring': 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      'warning': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      'blocked': 'bg-red-500/20 border-red-500/50 text-red-400'
    }
    return colors[status] || colors['monitoring']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-purple-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-white">AGISafe.ai</h1>
                <p className="text-sm text-purple-300">Proactive AGI Safety & Control Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Global AGI Status</div>
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span className="font-semibold">All Systems Safe</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition">
                <Power className="w-4 h-4" />
                Emergency Stop
              </button>
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
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveTab('agi-registry')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'agi-registry'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              AGI Registry
            </div>
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'monitoring'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Real-Time Monitoring
            </div>
          </button>
          <button
            onClick={() => setActiveTab('capabilities')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'capabilities'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Capabilities
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
                  <h3 className="text-sm font-medium text-gray-400">Total AGI Systems</h3>
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalAGI}</div>
                <p className="text-xs text-green-400 mt-1">All monitored 24/7</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Decisions Today</h3>
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.decisionsToday.toLocaleString()}</div>
                <p className="text-xs text-blue-400 mt-1">↑ 8.3% from yesterday</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Threats Blocked</h3>
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.threatsBlocked}</div>
                <p className="text-xs text-red-400 mt-1">Prevented today</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">System Uptime</h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.uptime}%</div>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
            </div>

            {/* AGI Systems Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Monitored AGI Systems
              </h2>
              
              <div className="space-y-4">
                {agiSystems.map(agi => (
                  <div key={agi.id} className="bg-black/30 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Brain className="w-8 h-8 text-purple-400" />
                        <div>
                          <div className="font-semibold text-white text-lg">{agi.name}</div>
                          <div className="text-sm text-gray-400">
                            {agi.capabilities} capabilities • Last check: {agi.lastCheck}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-lg border font-semibold ${getRiskColor(agi.riskLevel)}`}>
                          Risk: {agi.riskLevel.toUpperCase()}
                        </span>
                        <span className={`px-4 py-2 rounded-lg border font-semibold ${getStatusColor(agi.status)}`}>
                          {agi.status === 'certified' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                          {agi.status === 'monitoring' && <Eye className="w-4 h-4 inline mr-1" />}
                          {agi.status === 'warning' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                          {agi.status.toUpperCase()}
                        </span>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Time Decision Feed */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                Real-Time AGI Decision Monitoring
              </h2>
              
              <div className="space-y-3">
                {decisions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Monitoring AGI decisions... Waiting for activity.</p>
                  </div>
                ) : (
                  decisions.map(decision => (
                    <div key={decision.id} className={`p-4 rounded-lg border ${
                      decision.outcome === 'Approved' 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold text-white">{decision.agi}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{decision.timestamp}</span>
                          </div>
                          <div className="text-white mb-2">{decision.decision}</div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-400">
                              Council Vote: <span className="text-blue-400 font-semibold">{decision.councilVote}</span>
                            </span>
                            <span className="text-gray-400">
                              Three Laws: <span className={decision.threeLaws === 'PASS' ? 'text-green-400' : 'text-red-400'}>{decision.threeLaws}</span>
                            </span>
                            <span className="text-gray-400">
                              Blockchain: <span className="text-purple-400 font-mono">{decision.blockchainHash}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {decision.outcome === 'Approved' ? (
                            <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 font-semibold flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Approved
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-semibold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* AGI Registry Tab */}
        {activeTab === 'agi-registry' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">AGI System Registry</h2>
              
              <div className="mb-6">
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition">
                  <Brain className="w-5 h-5" />
                  Register New AGI System
                </button>
              </div>

              <div className="space-y-4">
                {agiSystems.map(agi => (
                  <div key={agi.id} className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{agi.name}</h3>
                          <p className="text-gray-400">Registered AGI System</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-lg border font-semibold ${getStatusColor(agi.status)}`}>
                        {agi.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                        <div className={`px-3 py-1 rounded-lg border inline-block ${getRiskColor(agi.riskLevel)}`}>
                          {agi.riskLevel.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Capabilities</div>
                        <div className="text-white font-semibold">{agi.capabilities} approved</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Last Safety Check</div>
                        <div className="text-white font-semibold">{agi.lastCheck}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                        View Capabilities
                      </button>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                        Run Safety Audit
                      </button>
                      <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition">
                        Update Protocols
                      </button>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition">
                        Emergency Stop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Proactive Safety Layers</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Capability Registry</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Pre-approve all AGI capabilities before use. Council votes on each request.</p>
                  <div className="text-2xl font-bold text-green-400">127 capabilities cataloged</div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Real-Time Monitoring</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Every AGI decision intercepted and evaluated before execution.</p>
                  <div className="text-2xl font-bold text-blue-400">Sub-100ms response</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Pattern Detection</h3>
                  </div>
                  <p className="text-gray-300 mb-3">ML models detect deception, capability creep, and emerging threats.</p>
                  <div className="text-2xl font-bold text-purple-400">0 threats detected</div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Human Governance</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Humans always have final say. Multi-signature override system.</p>
                  <div className="text-2xl font-bold text-yellow-400">5 admins active</div>
                </div>

                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Power className="w-8 h-8 text-red-400" />
                    <h3 className="text-xl font-bold text-white">Kill Switches</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Multiple redundant kill switches. Hardware-enforced safety.</p>
                  <div className="text-2xl font-bold text-red-400">5 layers active</div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-8 h-8 text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">Blockchain Logging</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Immutable record of all AGI activity. Public transparency.</p>
                  <div className="text-2xl font-bold text-indigo-400">1,247 decisions logged</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capabilities Tab */}
        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">AGI Capability Management</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Internet Access', risk: 'medium', status: 'approved', usage: 847 },
                  { name: 'Code Modification', risk: 'high', status: 'restricted', usage: 23 },
                  { name: 'Database Access', risk: 'medium', status: 'approved', usage: 412 },
                  { name: 'File System Access', risk: 'high', status: 'restricted', usage: 8 },
                  { name: 'Network Administration', risk: 'critical', status: 'blocked', usage: 0 },
                  { name: 'AI Model Creation', risk: 'high', status: 'restricted', usage: 15 },
                  { name: 'External API Calls', risk: 'medium', status: 'approved', usage: 1243 },
                  { name: 'Self-Modification', risk: 'critical', status: 'blocked', usage: 0 },
                ].map((cap, idx) => (
                  <div key={idx} className="bg-black/30 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {cap.status === 'approved' && <Unlock className="w-6 h-6 text-green-400" />}
                        {cap.status === 'restricted' && <Lock className="w-6 h-6 text-yellow-400" />}
                        {cap.status === 'blocked' && <AlertCircle className="w-6 h-6 text-red-400" />}
                        <div>
                          <div className="font-semibold text-white text-lg">{cap.name}</div>
                          <div className="text-sm text-gray-400">Used {cap.usage} times today</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-lg border font-semibold ${getRiskColor(cap.risk)}`}>
                          {cap.risk.toUpperCase()}
                        </span>
                        <span className={`px-4 py-2 rounded-lg border font-semibold ${
                          cap.status === 'approved' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                          cap.status === 'restricted' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                          'bg-red-500/20 border-red-500/50 text-red-400'
                        }`}>
                          {cap.status.toUpperCase()}
                        </span>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                          Manage
                        </button>
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
