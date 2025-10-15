import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const PLATFORMS = [
  { id: 'council', name: 'Council of AIs', url: 'https://councilof.ai', icon: '🏛️' },
  { id: 'proof', name: 'ProofOf.ai', url: 'https://proofof.ai', icon: '🔍' },
  { id: 'security', name: 'ASISecurity.ai', url: 'https://asisecurity.ai', icon: '🛡️' },
  { id: 'agi', name: 'AGISafe.ai', url: 'https://agisafe.ai', icon: '🤖' },
  { id: 'suicide', name: 'SuicideStop.ai', url: 'https://suicidestop.ai', icon: '💙' },
  { id: 'transparency', name: 'TransparencyOf.ai', url: 'https://transparencyof.ai', icon: '👁️' },
  { id: 'ethical', name: 'EthicalGovernanceOf.ai', url: 'https://ethicalgovernanceof.ai', icon: '⚖️' },
  { id: 'safety', name: 'SafetyOf.ai', url: 'https://safetyof.ai', icon: '🦺' },
  { id: 'accountability', name: 'AccountabilityOf.ai', url: 'https://accountabilityof.ai', icon: '📊' },
  { id: 'bias', name: 'BiasDetectionOf.ai', url: 'https://biasdetectionof.ai', icon: '🎯' },
  { id: 'privacy', name: 'DataPrivacyOf.ai', url: 'https://dataprivacyof.ai', icon: '🔒' },
];

export function PlatformSwitcher({ currentPlatform = 'council' }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const current = PLATFORMS.find(p => p.id === currentPlatform) || PLATFORMS[0];
  
  const handleSwitch = (platform) => {
    window.location.href = platform.url;
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-2xl">{current.icon}</span>
        <span className="font-medium text-gray-900 dark:text-white">{current.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleSwitch(platform)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  platform.id === currentPlatform
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="flex-1 text-left font-medium">{platform.name}</span>
                {platform.id === currentPlatform && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI Safety Empire - 11 Platforms, One Ecosystem
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

