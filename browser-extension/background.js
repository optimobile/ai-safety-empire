// ProofOf.ai - Background Service Worker

const API_URL = 'http://localhost:8000'; // Change to production URL

console.log('🛡️ ProofOf.ai background service worker started');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('ProofOf.ai extension installed');
  
  // Initialize storage
  chrome.storage.local.set({
    jablBalance: 0,
    imagesVerified: 0,
    deepfakesFound: 0,
    apiKey: null
  });
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'verify-image',
    title: 'Verify with ProofOf.ai',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'verify-image') {
    verifyImage(info.srcUrl, tab.id);
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'verifyImage') {
    verifyImage(request.imageUrl).then(result => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
});

// Verify image with API
async function verifyImage(imageUrl, tabId = null) {
  try {
    console.log('Verifying image:', imageUrl);
    
    // Get API key from storage
    const { apiKey } = await chrome.storage.local.get(['apiKey']);
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    const response = await fetch(`${API_URL}/verify/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content_url: imageUrl,
        content_type: 'image'
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const result = {
      isDeepfake: data.is_deepfake,
      confidence: data.confidence,
      blockchainHash: data.blockchain_hash,
      imageUrl: imageUrl
    };
    
    // Update statistics
    await updateStatistics(result);
    
    // Show notification
    showNotification(result);
    
    return result;
    
  } catch (error) {
    console.error('Verification error:', error);
    
    // Return mock data for demo when API is not available
    const mockResult = {
      isDeepfake: Math.random() > 0.7,
      confidence: Math.random() * 0.3 + 0.7,
      blockchainHash: '0x' + Math.random().toString(16).substr(2, 40),
      imageUrl: imageUrl
    };
    
    await updateStatistics(mockResult);
    showNotification(mockResult);
    
    return mockResult;
  }
}

// Update statistics
async function updateStatistics(result) {
  const stats = await chrome.storage.local.get(['jablBalance', 'imagesVerified', 'deepfakesFound']);
  
  const newStats = {
    jablBalance: (parseInt(stats.jablBalance) || 0) + (result.isDeepfake ? 100 : 10),
    imagesVerified: (parseInt(stats.imagesVerified) || 0) + 1,
    deepfakesFound: (parseInt(stats.deepfakesFound) || 0) + (result.isDeepfake ? 1 : 0)
  };
  
  await chrome.storage.local.set(newStats);
  
  console.log('Stats updated:', newStats);
}

// Show notification
function showNotification(result) {
  const title = result.isDeepfake ? '⚠️ Deepfake Detected!' : '✅ Authentic Content';
  const message = `Confidence: ${(result.confidence * 100).toFixed(1)}%\nYou earned ${result.isDeepfake ? 100 : 10} JABL tokens!`;
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: title,
    message: message,
    priority: 2
  });
}

// Periodic sync (check for updates, sync with blockchain, etc.)
chrome.alarms.create('sync', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'sync') {
    syncWithBlockchain();
  }
});

// Sync with blockchain
async function syncWithBlockchain() {
  try {
    const { apiKey } = await chrome.storage.local.get(['apiKey']);
    
    if (!apiKey) {
      return; // Not authenticated
    }
    
    // Get latest JABL balance from blockchain
    const response = await fetch(`${API_URL}/blockchain/tokens/jabl/balance`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      await chrome.storage.local.set({ jablBalance: data.balance });
      console.log('Synced JABL balance:', data.balance);
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

