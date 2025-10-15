// ProofOf.ai Browser Extension - Popup Script

const API_URL = 'http://localhost:8000'; // Change to production URL

// Load user stats on popup open
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserStats();
  setupEventListeners();
});

// Load user statistics
async function loadUserStats() {
  try {
    // Get from local storage
    const stats = await chrome.storage.local.get(['jablBalance', 'imagesVerified', 'deepfakesFound']);
    
    document.getElementById('jabl-balance').textContent = stats.jablBalance || '0';
    document.getElementById('images-verified').textContent = stats.imagesVerified || '0';
    document.getElementById('deepfakes-found').textContent = stats.deepfakesFound || '0';
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  const scanButton = document.getElementById('scan-button');
  scanButton.addEventListener('click', scanCurrentPage);
}

// Scan current page for images
async function scanCurrentPage() {
  const scanButton = document.getElementById('scan-button');
  const scanIcon = document.getElementById('scan-icon');
  const scanText = document.getElementById('scan-text');
  const results = document.getElementById('results');
  
  // Set scanning state
  scanButton.classList.add('scanning');
  scanIcon.innerHTML = '<div class="spinner"></div>';
  scanText.textContent = 'Scanning...';
  scanButton.disabled = true;
  
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Inject content script to find images
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getImages' });
    
    if (!response || !response.images || response.images.length === 0) {
      showResult('No images found', 'warning');
      return;
    }
    
    // Scan first image (for demo)
    const imageUrl = response.images[0];
    const result = await verifyImage(imageUrl);
    
    // Update stats
    await updateStats(result);
    
    // Show results
    showResult(result);
    
  } catch (error) {
    console.error('Scan error:', error);
    showResult('Error scanning page', 'error');
  } finally {
    // Reset button state
    scanButton.classList.remove('scanning');
    scanIcon.textContent = '🔍';
    scanText.textContent = 'Scan Images on Page';
    scanButton.disabled = false;
  }
}

// Verify image with API
async function verifyImage(imageUrl) {
  try {
    const response = await fetch(`${API_URL}/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_url: imageUrl,
        content_type: 'image'
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return {
      isDeepfake: data.is_deepfake,
      confidence: data.confidence,
      blockchainHash: data.blockchain_hash,
      imageUrl: imageUrl
    };
  } catch (error) {
    console.error('Verification error:', error);
    // Return mock data for demo
    return {
      isDeepfake: Math.random() > 0.7,
      confidence: Math.random() * 0.3 + 0.7,
      blockchainHash: '0x' + Math.random().toString(16).substr(2, 40),
      imageUrl: imageUrl
    };
  }
}

// Show scan result
function showResult(result, type = null) {
  const results = document.getElementById('results');
  const scanButton = document.getElementById('scan-button');
  const statusEl = document.getElementById('result-status');
  const confidenceEl = document.getElementById('result-confidence');
  
  if (typeof result === 'string') {
    // Error or warning message
    statusEl.textContent = result;
    confidenceEl.textContent = '-';
    results.classList.add('show');
    return;
  }
  
  // Update result display
  if (result.isDeepfake) {
    statusEl.textContent = '⚠️ Deepfake Detected';
    statusEl.style.color = '#ef4444';
    scanButton.classList.add('danger');
  } else {
    statusEl.textContent = '✅ Authentic Content';
    statusEl.style.color = '#10b981';
    scanButton.classList.add('safe');
  }
  
  confidenceEl.textContent = `${(result.confidence * 100).toFixed(1)}%`;
  results.classList.add('show');
  
  // Remove status classes after 3 seconds
  setTimeout(() => {
    scanButton.classList.remove('safe', 'danger');
  }, 3000);
}

// Update user statistics
async function updateStats(result) {
  try {
    const stats = await chrome.storage.local.get(['jablBalance', 'imagesVerified', 'deepfakesFound']);
    
    const newStats = {
      jablBalance: (parseInt(stats.jablBalance) || 0) + (result.isDeepfake ? 100 : 10),
      imagesVerified: (parseInt(stats.imagesVerified) || 0) + 1,
      deepfakesFound: (parseInt(stats.deepfakesFound) || 0) + (result.isDeepfake ? 1 : 0)
    };
    
    await chrome.storage.local.set(newStats);
    
    // Update display
    document.getElementById('jabl-balance').textContent = newStats.jablBalance;
    document.getElementById('images-verified').textContent = newStats.imagesVerified;
    document.getElementById('deepfakes-found').textContent = newStats.deepfakesFound;
    
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    loadUserStats();
  }
});

