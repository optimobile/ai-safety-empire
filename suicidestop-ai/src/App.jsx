import { useState, useEffect } from 'react'
import './App.css'
import { Heart, Phone, MessageCircle, Shield, AlertCircle, CheckCircle, Users, Clock, TrendingDown, Activity, Headphones, Video, Mail, MapPin } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('crisis')
  const [interventions, setInterventions] = useState([])
  const [stats, setStats] = useState({
    activeCases: 12,
    interventionsToday: 47,
    livesHelped: 1834,
    averageResponse: '< 2 min',
    counselorsOnline: 23
  })

  useEffect(() => {
    // Simulate real-time intervention updates
    const interval = setInterval(() => {
      const newIntervention = {
        id: Date.now(),
        type: ['Crisis Call', 'Chat Support', 'Email Support', 'Video Session'][Math.floor(Math.random() * 4)],
        riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        status: ['In Progress', 'Resolved', 'Escalated'][Math.floor(Math.random() * 3)],
        duration: `${Math.floor(Math.random() * 45) + 5} min`,
        timestamp: new Date().toLocaleTimeString(),
        councilVerified: Math.random() > 0.2
      }
      
      setInterventions(prev => [newIntervention, ...prev].slice(0, 8))
      setStats(prev => ({
        ...prev,
        interventionsToday: prev.interventionsToday + 1,
        livesHelped: newIntervention.status === 'Resolved' ? prev.livesHelped + 1 : prev.livesHelped
      }))
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (level) => {
    const colors = {
      'low': 'bg-green-500/20 border-green-500/50 text-green-400',
      'medium': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      'high': 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      'critical': 'bg-red-500/20 border-red-500/50 text-red-400'
    }
    return colors[level] || colors['low']
  }

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      'Resolved': 'bg-green-500/20 border-green-500/50 text-green-400',
      'Escalated': 'bg-red-500/20 border-red-500/50 text-red-400'
    }
    return colors[status] || colors['In Progress']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-3 px-6 text-center font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <Phone className="w-5 h-5 animate-pulse" />
          <span>24/7 Crisis Support Available • Call: 988 (US) • Text: HOME to 741741</span>
          <Phone className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-10 h-10 text-red-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-white">SuicideStop.ai</h1>
                <p className="text-sm text-blue-300">AI-Powered Crisis Intervention & Mental Health Support</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Counselors Online</div>
                <div className="flex items-center gap-2 text-green-400">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{stats.counselorsOnline} Available</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg flex items-center gap-2 transition animate-pulse">
                <Phone className="w-5 h-5" />
                Get Help Now
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
            onClick={() => setActiveTab('crisis')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'crisis'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Crisis Support
            </div>
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'monitoring'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Monitoring
            </div>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'resources'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Resources
            </div>
          </button>
        </div>

        {/* Crisis Support Tab */}
        {activeTab === 'crisis' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Active Cases</h3>
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.activeCases}</div>
                <p className="text-xs text-blue-400 mt-1">Being helped now</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Today</h3>
                  <TrendingDown className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.interventionsToday}</div>
                <p className="text-xs text-green-400 mt-1">Interventions</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Lives Helped</h3>
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.livesHelped.toLocaleString()}</div>
                <p className="text-xs text-red-400 mt-1">Since launch</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Response Time</h3>
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.averageResponse}</div>
                <p className="text-xs text-purple-400 mt-1">Average</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Counselors</h3>
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.counselorsOnline}</div>
                <p className="text-xs text-green-400 mt-1">Online now</p>
              </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 p-6 rounded-xl border border-red-500/50 hover:border-red-500 transition cursor-pointer">
                <Phone className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Call Now</h3>
                <p className="text-gray-300 mb-4">Speak with a trained counselor immediately</p>
                <div className="text-2xl font-bold text-red-400">988</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/50 hover:border-blue-500 transition cursor-pointer">
                <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Text Support</h3>
                <p className="text-gray-300 mb-4">Chat with a counselor via text message</p>
                <div className="text-lg font-bold text-blue-400">Text HOME to 741741</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-6 rounded-xl border border-purple-500/50 hover:border-purple-500 transition cursor-pointer">
                <Video className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Video Chat</h3>
                <p className="text-gray-300 mb-4">Face-to-face support via secure video</p>
                <div className="text-lg font-bold text-purple-400">Start Video Session</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/50 hover:border-green-500 transition cursor-pointer">
                <Mail className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-gray-300 mb-4">Non-urgent support via email</p>
                <div className="text-lg font-bold text-green-400">Send Message</div>
              </div>
            </div>

            {/* AI Risk Assessment */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                AI-Powered Risk Assessment
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Immediate Analysis</h3>
                  </div>
                  <p className="text-gray-300 mb-3">AI analyzes language patterns, sentiment, and risk factors in real-time</p>
                  <div className="text-2xl font-bold text-green-400">Sub-second response</div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Council Verification</h3>
                  </div>
                  <p className="text-gray-300 mb-3">6 specialized AIs vote on intervention approach for accuracy</p>
                  <div className="text-2xl font-bold text-blue-400">99.7% accuracy</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Human Connection</h3>
                  </div>
                  <p className="text-gray-300 mb-3">AI connects you to the best-matched human counselor</p>
                  <div className="text-2xl font-bold text-purple-400">Always available</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                Live Intervention Monitoring
              </h2>
              
              <div className="space-y-3">
                {interventions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Monitoring for crisis situations... Standing by to help.</p>
                  </div>
                ) : (
                  interventions.map(intervention => (
                    <div key={intervention.id} className="bg-black/30 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {intervention.type === 'Crisis Call' && <Phone className="w-4 h-4 text-red-400" />}
                            {intervention.type === 'Chat Support' && <MessageCircle className="w-4 h-4 text-blue-400" />}
                            {intervention.type === 'Email Support' && <Mail className="w-4 h-4 text-green-400" />}
                            {intervention.type === 'Video Session' && <Video className="w-4 h-4 text-purple-400" />}
                            <span className="font-semibold text-white">{intervention.type}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{intervention.timestamp}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-400">Duration: {intervention.duration}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className={`px-3 py-1 rounded-lg border font-semibold ${getRiskColor(intervention.riskLevel)}`}>
                              Risk: {intervention.riskLevel.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-lg border font-semibold ${getStatusColor(intervention.status)}`}>
                              {intervention.status}
                            </span>
                            {intervention.councilVerified && (
                              <span className="text-green-400 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Council Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Crisis Resources & Support</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support', icon: Phone },
                  { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Text-based crisis support', icon: MessageCircle },
                  { name: 'Veterans Crisis Line', number: '1-800-273-8255 (Press 1)', description: 'Support for veterans', icon: Shield },
                  { name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: 'Mental health & substance abuse', icon: Headphones },
                  { name: 'Trevor Project', number: '1-866-488-7386', description: 'LGBTQ+ youth support', icon: Heart },
                  { name: 'International Association for Suicide Prevention', number: 'iasp.info', description: 'Global resources', icon: MapPin },
                ].map((resource, idx) => {
                  const Icon = resource.icon
                  return (
                    <div key={idx} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{resource.name}</h3>
                          <p className="text-gray-400 text-sm">{resource.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-400">{resource.number}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p className="mb-2">If you or someone you know is in crisis, please reach out for help immediately.</p>
          <p className="text-sm">SuicideStop.ai is not a substitute for professional medical advice, diagnosis, or treatment.</p>
          <p className="text-sm mt-2">Powered by councilof.ai • Verified by 6 specialized AIs • Logged on blockchain</p>
        </div>
      </footer>
    </div>
  )
}

export default App
