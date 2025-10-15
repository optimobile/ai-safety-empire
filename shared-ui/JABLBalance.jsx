import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp } from 'lucide-react';

export function JABLBalance({ userId }) {
  const [balance, setBalance] = useState(0);
  const [aegisBalance, setAegisBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBalance();
    // Update every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [userId]);
  
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.aisafety.ai/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBalance(data.jabl_balance || 0);
        setAegisBalance(data.aegis_balance || 0);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg">
        <Coins className="w-5 h-5 text-yellow-600 animate-pulse" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-4">
      {/* JABL Balance */}
      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <Coins className="w-5 h-5 text-yellow-600" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">JABL</span>
          <span className="font-bold text-yellow-700 dark:text-yellow-400">{formatNumber(balance)}</span>
        </div>
      </div>
      
      {/* AEGIS Balance */}
      {aegisBalance > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">AEGIS</span>
            <span className="font-bold text-blue-700 dark:text-blue-400">{formatNumber(aegisBalance)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

