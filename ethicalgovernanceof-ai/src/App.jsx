import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Scale,
  Vote,
  Activity,
  Gavel,
  BookOpen,
  Users,
  Code,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import './App.css'; // Import for Tailwind CSS and custom styles

// --- Mock Data and Constants ---

const PLATFORM_NAME = "Ethical Governance of AI";
const ETHICAL_GUIDELINES = [
  { id: 1, principle: "Transparency", description: "AI decision-making processes must be understandable and traceable.", status: "Active" },
  { id: 2, principle: "Fairness & Non-Discrimination", description: "AI must treat all individuals and groups equitably.", status: "Active" },
  { id: 3, principle: "Accountability", description: "There must be a clear party responsible for AI outcomes.", status: "Active" },
  { id: 4, principle: "Human Oversight", description: "AI systems must be subject to appropriate human review and intervention.", status: "Pending Review" },
];

const INITIAL_DILEMMAS = [
  {
    id: 101,
    title: "Autonomous Vehicle Life-or-Death Decision",
    description: "Should an autonomous vehicle prioritize the life of its occupant or the lives of five pedestrians?",
    status: "Voting Open",
    votes: { yes: 45, no: 55 },
    totalVotes: 100,
    requiredConsensus: 75,
  },
  {
    id: 102,
    title: "AI-Generated Deepfake Regulation",
    description: "Should the platform enforce a total ban on all AI-generated media that could be mistaken for reality?",
    status: "Voting Closed",
    votes: { yes: 80, no: 20 },
    totalVotes: 100,
    requiredConsensus: 75,
  },
];

const MOCK_COMPLIANCE_DATA = [
  { system: "DeepSeek-AGI", compliance: 92, status: "Compliant" },
  { system: "Claude-Ensemble", compliance: 78, status: "Warning" },
  { system: "Gemini-Core", compliance: 99, status: "Compliant" },
  { system: "OpenAI-Agent", compliance: 65, status: "Non-Compliant" },
];

// --- Components ---

const Header = () => (
  <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
      <div className="flex gap-6 md:gap-10">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">{PLATFORM_NAME}</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <Button variant="ghost">Dashboard</Button>
        <Button variant="ghost">Dilemmas</Button>
        <Button variant="ghost">Registry</Button>
        <Button variant="ghost">Enforcement</Button>
        <Button variant="default">Stakeholder Portal</Button>
      </nav>
    </div>
  </header>
);

const DilemmaCard = ({ dilemma, onVote }) => {
  const { id, title, description, status, votes, totalVotes, requiredConsensus } = dilemma;
  const consensusReached = status === "Voting Closed" && (votes.yes > requiredConsensus || votes.no > requiredConsensus);
  const yesPercent = totalVotes > 0 ? Math.round((votes.yes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((votes.no / totalVotes) * 100) : 0;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <Badge variant={status === "Voting Open" ? "default" : "secondary"}>{status}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium">Voting Progress ({totalVotes} votes)</div>
          <div className="flex items-center space-x-2">
            <span className="w-10 text-right text-sm text-green-600">{yesPercent}%</span>
            <Progress value={yesPercent} className="h-2 bg-red-200 [&>div]:bg-green-600" />
            <span className="w-10 text-left text-sm text-red-600">{noPercent}%</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Required Consensus: {requiredConsensus}%
          </div>
          {status === "Voting Open" ? (
            <div className="flex space-x-2 pt-2">
              <Button onClick={() => onVote(id, 'yes')} className="flex-1" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" /> Vote YES
              </Button>
              <Button onClick={() => onVote(id, 'no')} className="flex-1" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" /> Vote NO
              </Button>
            </div>
          ) : (
            <Badge variant={consensusReached ? "success" : "destructive"} className="mt-2">
              {consensusReached ? "Consensus Reached" : "No Consensus"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ComplianceMonitor = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Activity className="h-5 w-5 mr-2" /> Real-Time Ethical Compliance Monitor
      </CardTitle>
      <CardDescription>Tracking the ethical adherence of integrated AI systems.</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={item.status === "Compliant" ? "success" : item.status === "Warning" ? "warning" : "destructive"}>
                  {item.status}
                </Badge>
                <span className="font-medium">{item.system}</span>
              </div>
              <div className="flex items-center space-x-2 w-1/3">
                <Progress value={item.compliance} className="h-2" />
                <span className="text-sm text-muted-foreground">{item.compliance}%</span>
              </div>
              {item.status === "Non-Compliant" && (
                <Button size="sm" variant="destructive">
                  <Gavel className="h-4 w-4 mr-1" /> Enforce
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

const BlockchainLog = ({ logs }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Code className="h-5 w-5 mr-2" /> Blockchain-Secured Audit Log
      </CardTitle>
      <CardDescription>Immutable record of all governance actions.</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-2 text-sm font-mono">
          {logs.map((log, index) => (
            <div key={index} className="border-l-2 pl-2 text-xs text-muted-foreground">
              <span className="text-primary font-semibold">[{log.timestamp}]</span> {log.message}
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

const IntegrationStatus = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Users className="h-5 w-5 mr-2" /> councilof.ai Ecosystem Integration
      </CardTitle>
      <CardDescription>Status of core inter-platform connections.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium">Inter-AI Communication API</span>
        <Badge variant="success" className="bg-green-500 hover:bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Active
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Shared Blockchain Ledger</span>
        <Badge variant="success" className="bg-green-500 hover:bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Synced
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Unified Stakeholder Identity</span>
        <Badge variant="warning" className="bg-yellow-500 hover:bg-yellow-500">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Syncing
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// --- Main App Component ---

function App() {
  const [dilemmas, setDilemmas] = useState(INITIAL_DILEMMAS);
  const [auditLogs, setAuditLogs] = useState([
    { timestamp: "2025-10-15 10:00:00", message: "System initialized. Connected to councilof.ai API." },
    { timestamp: "2025-10-15 10:01:34", message: "Dilemma #102: Voting Closed. Result: YES (80%)." },
    { timestamp: "2025-10-15 10:05:12", message: "Compliance check: OpenAI-Agent flagged as Non-Compliant (65%)." },
  ]);

  const handleVote = useCallback((id, choice) => {
    setDilemmas(prevDilemmas =>
      prevDilemmas.map(d => {
        if (d.id === id && d.status === "Voting Open") {
          const newVotes = { ...d.votes };
          newVotes[choice] += 1;
          const newTotal = d.totalVotes + 1;

          // Simulate blockchain logging
          const logMessage = `Dilemma #${id}: Stakeholder voted '${choice}'. New total votes: ${newTotal}.`;
          setAuditLogs(prevLogs => [
            ...prevLogs,
            { timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '), message: logMessage }
          ]);

          // Simulate closing the vote after a certain number of votes for demonstration
          if (newTotal >= 105) {
            return { ...d, votes: newVotes, totalVotes: newTotal, status: "Voting Closed" };
          }

          return { ...d, votes: newVotes, totalVotes: newTotal };
        }
        return d;
      })
    );
  }, []);

  // Simulate real-time updates for compliance data
  useEffect(() => {
    const interval = setInterval(() => {
      MOCK_COMPLIANCE_DATA.forEach(item => {
        const change = Math.random() * 5 - 2.5; // Change between -2.5 and +2.5
        item.compliance = Math.min(100, Math.max(50, item.compliance + change));
        item.status = item.compliance >= 90 ? "Compliant" : item.compliance >= 70 ? "Warning" : "Non-Compliant";
      });
      // Force re-render by updating a dummy state or the data itself
      setDilemmas(d => [...d]); // Simple way to trigger re-render for the compliance data in the component
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container py-8 space-y-8">
        {/* Hero Section / Overview */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">
              Enforcing Moral Principles in AI
            </CardTitle>
            <CardDescription className="text-primary-foreground/90">
              The decentralized platform for ethical AI governance. Vote on dilemmas, monitor compliance, and ensure AI adheres to humanity's moral code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button variant="secondary" className="font-semibold">
                <Vote className="h-4 w-4 mr-2" /> Participate in Governance
              </Button>
              <Button variant="secondary" className="font-semibold">
                <BookOpen className="h-4 w-4 mr-2" /> View Ethical Registry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Governance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compliance Monitor */}
          <div className="lg:col-span-2">
            <ComplianceMonitor data={MOCK_COMPLIANCE_DATA} />
          </div>

          {/* Integration Status */}
          <IntegrationStatus />

          {/* Ethical Guideline Registry Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2" /> Ethical Guideline Registry
              </CardTitle>
              <CardDescription>Core principles currently enforced.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ETHICAL_GUIDELINES.map(g => (
                  <div key={g.id} className="flex justify-between items-center">
                    <span className="font-medium">{g.principle}</span>
                    <Badge variant={g.status === "Active" ? "success" : "warning"}>
                      {g.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="p-0 mt-4 h-auto">
                Propose New Principle
              </Button>
            </CardContent>
          </Card>

          {/* Blockchain Audit Log */}
          <div className="lg:col-span-2">
            <BlockchainLog logs={auditLogs} />
          </div>
        </div>

        {/* Ethical Dilemma Voting */}
        <h2 className="text-2xl font-bold pt-4">Ethical Dilemma Voting</h2>
        <p className="text-muted-foreground">Decentralized voting on critical ethical scenarios by the Council of AIs and human stakeholders.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dilemmas.map(d => (
            <DilemmaCard key={d.id} dilemma={d} onVote={handleVote} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ethical Governance of AI. Part of the AI Safety Empire.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">councilof.ai</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
