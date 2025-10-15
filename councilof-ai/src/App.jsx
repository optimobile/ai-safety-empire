import { useState } from 'react'
import './App.css'
import { Shield, Vote, Database, TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('submit')
  const [decisionText, setDecisionText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitting(false)
    setDecisionText('')
    alert('Decision submitted to Council of AIs!')
  }

  // Mock data
  const recentDecisions = [
    {
      id: 1,
      text: 'Should AI-generated content require watermarks?',
      status: 'approved',
      votes: { approve: 5, reject: 1 },
      timestamp: '2 hours ago',
      blockchainHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    },
    {
      id: 2,
      text: 'Implement stricter deepfake detection thresholds?',
      status: 'approved',
      votes: { approve: 6, reject: 0 },
      timestamp: '5 hours ago',
      blockchainHash: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
    },
    {
      id: 3,
      text: 'Allow AI voice cloning for personal use?',
      status: 'rejected',
      votes: { approve: 2, reject: 4 },
      timestamp: '1 day ago',
      blockchainHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t'
    }
  ]

  const stats = {
    totalDecisions: 2847,
    activeUsers: 1846,
    successRate: 99.97,
    avgResponseTime: 285
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Council of AIs</h1>
                <p className="text-purple-300 text-sm">Democratic AI Governance Platform</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalDecisions.toLocaleString()}</div>
              <div className="text-sm text-purple-300">Total Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-purple-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
              <div className="text-sm text-purple-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.avgResponseTime}ms</div>
              <div className="text-sm text-purple-300">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'submit'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            <Vote className="w-5 h-5 inline mr-2" />
            Submit Decision
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'recent'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            <Database className="w-5 h-5 inline mr-2" />
            Recent Decisions
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'stats'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Statistics
          </button>
        </div>

        {/* Submit Decision Tab */}
        {activeTab === 'submit' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Submit a Decision to the Council</h2>
            <p className="text-purple-200 mb-6">
              The Council of 6 AIs will vote on your proposal. Requires 5/6 approval to pass.
            </p>
            
            <textarea
              value={decisionText}
              onChange={(e) => setDecisionText(e.target.value)}
              placeholder="Describe the AI safety decision or policy you want the Council to vote on..."
              className="w-full h-40 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-purple-300">
                <Users className="w-4 h-4 inline mr-1" />
                6 AI models will vote on this decision
              </div>
              <button
                onClick={handleSubmit}
                disabled={!decisionText || submitting}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
              >
                {submitting ? 'Submitting...' : 'Submit to Council'}
              </button>
            </div>

            {submitting && (
              <div className="mt-6 p-4 bg-purple-900/50 rounded-lg border border-purple-500/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-white font-medium">Council is voting...</span>
                </div>
                <div className="text-sm text-purple-200 space-y-1">
                  <div>✓ GPT-4 analyzing...</div>
                  <div>✓ Claude evaluating...</div>
                  <div>✓ Gemini reviewing...</div>
                  <div>⏳ Llama processing...</div>
                  <div>⏳ Mistral considering...</div>
                  <div>⏳ Grok assessing...</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Decisions Tab */}
        {activeTab === 'recent' && (
          <div className="space-y-4">
            {recentDecisions.map((decision) => (
              <div
                key={decision.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{decision.text}</h3>
                    <div className="flex items-center gap-4 text-sm text-purple-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {decision.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        {decision.blockchainHash.substring(0, 20)}...
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-medium ${
                    decision.status === 'approved'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                      : 'bg-red-500/20 text-red-300 border border-red-500/50'
                  }`}>
                    {decision.status === 'approved' ? (
                      <><CheckCircle className="w-4 h-4 inline mr-1" />Approved</>
                    ) : (
                      <><XCircle className="w-4 h-4 inline mr-1" />Rejected</>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex-1 bg-white/5 rounded-lg p-3">
                    <div className="text-sm text-purple-300 mb-1">Council Vote</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-green-500/20 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(decision.votes.approve / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium">
                        {decision.votes.approve}/6
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Decision Outcomes</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Approved</span>
                  <span className="text-green-400 font-bold">2,456 (86%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Rejected</span>
                  <span className="text-red-400 font-bold">391 (14%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Pending</span>
                  <span className="text-yellow-400 font-bold">12</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Council Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Avg Decision Time</span>
                  <span className="text-white font-bold">2.3 seconds</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Consensus Rate</span>
                  <span className="text-white font-bold">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Blockchain Verified</span>
                  <span className="text-green-400 font-bold">100%</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">AI Council Members</h3>
              <div className="grid grid-cols-3 gap-4">
                {['GPT-4', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Grok'].map((ai) => (
                  <div key={ai} className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-white mb-1">{ai}</div>
                    <div className="text-sm text-purple-300">Active</div>
                    <div className="text-xs text-green-400 mt-2">✓ Online</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-lg bg-white/5 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-purple-300 text-sm">
          <p>Powered by AI Safety Empire • Protected by Jabulon's Law</p>
          <p className="mt-1">All decisions verified on Polygon blockchain</p>
        </div>
      </footer>
    </div>
  )
}

export default App

