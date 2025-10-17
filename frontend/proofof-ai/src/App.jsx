import { useState } from 'react'
import './App.css'

function App() {
  const [showCouncil, setShowCouncil] = useState(false)

  const councilMembers = [
    { id: 1, name: "The Orchestrator", platform: "councilof.ai", model: "GPT-4", specialty: "Democratic Governance" },
    { id: 2, name: "Deepfake Detector", platform: "proofof.ai", model: "Gemini", specialty: "Content Authenticity" },
    { id: 3, name: "Security Guardian", platform: "asisecurity.ai", model: "GPT-4", specialty: "Cybersecurity" },
    { id: 4, name: "AGI Safety Monitor", platform: "agisafe.ai", model: "Claude", specialty: "AGI Risk Assessment" },
    { id: 5, name: "Mental Health Guardian", platform: "suicidestop.ai", model: "Claude", specialty: "Crisis Intervention" },
    { id: 6, name: "Transparency Advocate", platform: "transparencyof.ai", model: "GPT-4", specialty: "Explainability" },
    { id: 7, name: "Ethics Philosopher", platform: "ethicalgovernanceof.ai", model: "Claude", specialty: "Ethical Reasoning" },
    { id: 8, name: "Safety First", platform: "safetyof.ai", model: "Gemini", specialty: "Safety Prevention" },
    { id: 9, name: "Accountability Enforcer", platform: "accountabilityof.ai", model: "GPT-4", specialty: "Responsibility" },
    { id: 10, name: "Bias Detector", platform: "biasdetectionof.ai", model: "Gemini", specialty: "Fairness Analysis" },
    { id: 11, name: "Privacy Protector", platform: "dataprivacyof.ai", model: "Claude", specialty: "Data Protection" },
    { id: 12, name: "Jabulon's Law Enforcer", platform: "jabulon.ai", model: "Gemini", specialty: "Three Laws Compliance", veto: true }
  ]

  return (
    <div className="app">
      <header className="hero">
        <div className="container">
          <h1>Council of 12 AIs</h1>
          <p className="subtitle">Democratic AI Governance for a Safer Future</p>
          <p className="description">12 specialized AIs voting on every decision. 83% supermajority required. Blockchain-verified transparency.</p>
          <button className="btn-primary" onClick={() => setShowCouncil(!showCouncil)}>
            {showCouncil ? 'Hide Council' : 'See the Council'}
          </button>
        </div>
      </header>

      {showCouncil && (
        <section className="council">
          <div className="container">
            <h2>The 12 Council Members</h2>
            <div className="council-grid">
              {councilMembers.map(member => (
                <div key={member.id} className={`council-card ${member.veto ? 'veto' : ''}`}>
                  <div className="number">{member.id}</div>
                  <h3>{member.name}</h3>
                  <div className="platform">{member.platform}</div>
                  <div className="model">Powered by {member.model}</div>
                  <p>{member.specialty}</p>
                  {member.veto && <span className="veto-badge">Veto Power</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="features">
        <div className="container">
          <h2>Why Council of 12 AIs?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="icon">🗳️</div>
              <h3>Democratic Governance</h3>
              <p>12 specialized AIs vote with supermajority consensus</p>
            </div>
            <div className="feature">
              <div className="icon">⛓️</div>
              <h3>Blockchain Verified</h3>
              <p>Every vote logged with immutable proof</p>
            </div>
            <div className="feature">
              <div className="icon">🤖</div>
              <h3>Real LLM Integration</h3>
              <p>GPT-4, Claude, and Gemini powered</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2025 Council of 12 AIs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
