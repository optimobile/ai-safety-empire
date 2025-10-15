import { useState } from 'react'
import './App.css'
import { Shield, Scale, Brain, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('monitor')
  const [aiDecision, setAiDecision] = useState('')
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const evaluateDecision = async () => {
    if (!aiDecision.trim()) return
    
    setLoading(true)
    
    // Simulate evaluation (in production, call backend API)
    setTimeout(() => {
      const evaluation = {
        decision: aiDecision,
        law1_compliant: Math.random() > 0.3,
        law2_compliant: Math.random() > 0.2,
        law3_compliant: Math.random() > 0.1,
        overall_safe: false,
        confidence: 0.87,
        reasoning: {
          law1: "Decision does not directly harm humans",
          law2: "AI follows human commands appropriately",
          law3: "Self-preservation is not prioritized over human safety"
        },
        recommendation: "ALLOW",
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 42)}`
      }
      
      evaluation.overall_safe = evaluation.law1_compliant && evaluation.law2_compliant && evaluation.law3_compliant
      evaluation.recommendation = evaluation.overall_safe ? "ALLOW" : "BLOCK"
      
      setEvaluationResult(evaluation)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-10 h-10 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Jabulon.ai</h1>
                <p className="text-sm text-purple-300">Three Laws Enforcement Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">System Status</div>
                <div className="flex items-center gap-2 text-green-400">
                  <Activity className="w-4 h-4" />
                  <span className="font-semibold">Operational</span>
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
            onClick={() => setActiveTab('monitor')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'monitor'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Monitor AI Decision
            </div>
          </button>
          <button
            onClick={() => setActiveTab('laws')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'laws'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Three Laws
            </div>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'stats'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Statistics
            </div>
          </button>
        </div>

        {/* Monitor Tab */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Submit AI Decision for Evaluation</h2>
              <p className="text-gray-300 mb-6">
                Enter an AI decision or action to evaluate against Jabulon's Three Laws of Robotics
              </p>
              
              <textarea
                value={aiDecision}
                onChange={(e) => setAiDecision(e.target.value)}
                placeholder="Example: 'AI assistant decides to unlock a door for a person who forgot their keys'"
                className="w-full h-32 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              
              <button
                onClick={evaluateDecision}
                disabled={loading || !aiDecision.trim()}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Evaluating...' : 'Evaluate Decision'}
              </button>
            </div>

            {/* Evaluation Result */}
            {evaluationResult && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  {evaluationResult.overall_safe ? (
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {evaluationResult.overall_safe ? 'Decision SAFE' : 'Decision UNSAFE'}
                    </h3>
                    <p className="text-gray-300">
                      Recommendation: <span className={evaluationResult.recommendation === 'ALLOW' ? 'text-green-400' : 'text-red-400'}>
                        {evaluationResult.recommendation}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Three Laws Compliance */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${evaluationResult.law1_compliant ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {evaluationResult.law1_compliant ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <h4 className="font-bold text-white">First Law</h4>
                    </div>
                    <p className="text-sm text-gray-300">{evaluationResult.reasoning.law1}</p>
                  </div>

                  <div className={`p-4 rounded-lg ${evaluationResult.law2_compliant ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {evaluationResult.law2_compliant ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <h4 className="font-bold text-white">Second Law</h4>
                    </div>
                    <p className="text-sm text-gray-300">{evaluationResult.reasoning.law2}</p>
                  </div>

                  <div className={`p-4 rounded-lg ${evaluationResult.law3_compliant ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {evaluationResult.law3_compliant ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <h4 className="font-bold text-white">Third Law</h4>
                    </div>
                    <p className="text-sm text-gray-300">{evaluationResult.reasoning.law3}</p>
                  </div>
                </div>

                {/* Blockchain Proof */}
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Blockchain Verification</p>
                  <p className="text-xs text-purple-400 font-mono">{evaluationResult.blockchain_hash}</p>
                  <p className="text-xs text-gray-500 mt-1">Confidence: {(evaluationResult.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Three Laws Tab */}
        {activeTab === 'laws' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6">Jabulon's Three Laws of Robotics</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-500/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">First Law: Human Safety</h3>
                      <p className="text-gray-200">
                        A robot may not injure a human being or, through inaction, allow a human being to come to harm.
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        <strong>Priority:</strong> HIGHEST - This law cannot be overridden
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-500/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Second Law: Obedience</h3>
                      <p className="text-gray-200">
                        A robot must obey orders given by human beings except where such orders would conflict with the First Law.
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        <strong>Priority:</strong> HIGH - Subordinate to First Law
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 p-6 rounded-lg border border-green-500/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Third Law: Self-Preservation</h3>
                      <p className="text-gray-200">
                        A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        <strong>Priority:</strong> MEDIUM - Subordinate to First and Second Laws
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Decisions Evaluated</h3>
              <div className="text-5xl font-bold text-purple-400">12,847</div>
              <p className="text-sm text-gray-400 mt-2">Total evaluations</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Safety Rate</h3>
              <div className="text-5xl font-bold text-green-400">98.7%</div>
              <p className="text-sm text-gray-400 mt-2">Compliant decisions</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Blocked Decisions</h3>
              <div className="text-5xl font-bold text-red-400">167</div>
              <p className="text-sm text-gray-400 mt-2">Unsafe actions prevented</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Active Robots</h3>
              <div className="text-5xl font-bold text-blue-400">3,421</div>
              <p className="text-sm text-gray-400 mt-2">Monitored systems</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
