import { useState, useEffect } from 'react'
import './App.css'
import { Eye, FileText, CheckCircle, AlertTriangle, Search, Filter, Download, Share2, Lock, Unlock, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [explanations, setExplanations] = useState([])
  const [stats, setStats] = useState({
    totalDecisions: 15847,
    explained: 15723,
    transparency: 99.2,
    avgExplanationTime: '1.3s'
  })

  useEffect(() => {
    // Simulate real-time AI decision explanations
    const interval = setInterval(() => {
      const newExplanation = {
        id: Date.now(),
        ai: ['GPT-4', 'Claude 3', 'Gemini Pro', 'Llama 3'][Math.floor(Math.random() * 4)],
        decision: [
          'Content moderation decision',
          'Loan approval recommendation',
          'Medical diagnosis suggestion',
          'Job candidate ranking',
          'Product recommendation'
        ][Math.floor(Math.random() * 5)],
        explanation: 'Based on pattern analysis, historical data, and ethical guidelines...',
        transparency: Math.floor(Math.random() * 30) + 70,
        factors: Math.floor(Math.random() * 8) + 3,
        timestamp: new Date().toLocaleTimeString(),
        verified: Math.random() > 0.1
      }
      
      setExplanations(prev => [newExplanation, ...prev].slice(0, 10))
      setStats(prev => ({
        ...prev,
        totalDecisions: prev.totalDecisions + 1,
        explained: newExplanation.verified ? prev.explained + 1 : prev.explained
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getTransparencyColor = (score) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/50 text-green-400'
    if (score >= 75) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    return 'bg-red-500/20 border-red-500/50 text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-10 h-10 text-indigo-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-white">TransparencyOf.ai</h1>
                <p className="text-sm text-indigo-300">AI Transparency & Explainability Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Transparency Score</div>
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{stats.transparency}%</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-2 transition">
                <Download className="w-4 h-4" />
                Export Report
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
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveTab('explanations')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'explanations'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Explanations
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics
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
                  <h3 className="text-sm font-medium text-gray-400">Total Decisions</h3>
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalDecisions.toLocaleString()}</div>
                <p className="text-xs text-indigo-400 mt-1">All explained</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Explained</h3>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.explained.toLocaleString()}</div>
                <p className="text-xs text-green-400 mt-1">99.2% coverage</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Transparency</h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.transparency}%</div>
                <p className="text-xs text-green-400 mt-1">↑ 2.1% this month</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Avg Time</h3>
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.avgExplanationTime}</div>
                <p className="text-xs text-purple-400 mt-1">Per explanation</p>
              </div>
            </div>

            {/* Transparency Layers */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Transparency Layers</h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-8 h-8 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Decision Visibility</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Every AI decision is logged and visible to authorized users</p>
                  <div className="text-2xl font-bold text-green-400">100% visible</div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Explanation Quality</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Human-readable explanations for all decisions</p>
                  <div className="text-2xl font-bold text-blue-400">99.2% explained</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Factor Analysis</h3>
                  </div>
                  <p className="text-gray-300 mb-3">Breakdown of all factors influencing decisions</p>
                  <div className="text-2xl font-bold text-purple-400">Avg 5.7 factors</div>
                </div>
              </div>
            </div>

            {/* Real-Time Explanations Feed */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
                Real-Time AI Explanations
              </h2>
              
              <div className="space-y-3">
                {explanations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Monitoring AI decisions... Waiting for activity.</p>
                  </div>
                ) : (
                  explanations.map(exp => (
                    <div key={exp.id} className="bg-black/30 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <span className="font-semibold text-white">{exp.ai}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{exp.timestamp}</span>
                          </div>
                          <div className="text-white mb-2">{exp.decision}</div>
                          <div className="text-sm text-gray-400 mb-2">{exp.explanation}</div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className={`px-3 py-1 rounded-lg border font-semibold ${getTransparencyColor(exp.transparency)}`}>
                              Transparency: {exp.transparency}%
                            </span>
                            <span className="text-gray-400">
                              Factors: <span className="text-indigo-400 font-semibold">{exp.factors}</span>
                            </span>
                            {exp.verified && (
                              <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Council Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
                          View Full
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Explanations Tab */}
        {activeTab === 'explanations' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">AI Decision Explanations</h2>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold flex items-center gap-2 transition">
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold flex items-center gap-2 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { ai: 'GPT-4', decision: 'Content moderation: Flagged as inappropriate', transparency: 95, factors: 7 },
                  { ai: 'Claude 3', decision: 'Loan approval: Recommended approval', transparency: 92, factors: 12 },
                  { ai: 'Gemini Pro', decision: 'Medical diagnosis: Suggested further testing', transparency: 88, factors: 15 },
                  { ai: 'Llama 3', decision: 'Job ranking: Candidate scored 87/100', transparency: 91, factors: 9 },
                ].map((exp, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-lg border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{exp.ai}</h3>
                          <p className="text-gray-400 text-sm">{exp.decision}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-lg border font-semibold ${getTransparencyColor(exp.transparency)}`}>
                        {exp.transparency}% transparent
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Decision Factors</div>
                        <div className="text-white font-semibold">{exp.factors} identified</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Explanation Length</div>
                        <div className="text-white font-semibold">847 words</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Verification</div>
                        <div className="text-green-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
                        View Full Explanation
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Transparency Analytics</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <PieChart className="w-8 h-8 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Explanation Coverage</h3>
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-2">99.2%</div>
                  <p className="text-gray-300">of all AI decisions have explanations</p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Average Transparency</h3>
                  </div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">91.7%</div>
                  <p className="text-gray-300">across all AI systems</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Improvement Rate</h3>
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">+2.1%</div>
                  <p className="text-gray-300">transparency increase this month</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Response Time</h3>
                  </div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">1.3s</div>
                  <p className="text-gray-300">average explanation generation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>Powered by councilof.ai • Verified by 6 specialized AIs • Logged on blockchain</p>
        </div>
      </footer>
    </div>
  )
}

export default App
