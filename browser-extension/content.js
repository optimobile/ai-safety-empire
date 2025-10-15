// ProofOf.ai - Content Script
// Runs on all web pages to detect and analyze images

console.log('🛡️ ProofOf.ai extension loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getImages') {
    const images = getAllImages();
    sendResponse({ images });
  }
  return true; // Keep message channel open
});

// Get all images on the page
function getAllImages() {
  const images = [];
  const imgElements = document.querySelectorAll('img');
  
  imgElements.forEach(img => {
    if (img.src && img.src.startsWith('http')) {
      // Filter out tiny images (likely icons)
      if (img.naturalWidth > 100 && img.naturalHeight > 100) {
        images.push(img.src);
      }
    }
  });
  
  return images;
}

// Add visual indicator to images
function addImageIndicators() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (img.naturalWidth > 100 && img.naturalHeight > 100) {
      // Add scan button overlay
      if (!img.dataset.proofofScanned) {
        addScanOverlay(img);
        img.dataset.proofofScanned = 'true';
      }
    }
  });
}

// Add scan overlay to image
function addScanOverlay(img) {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'proofof-overlay';
  overlay.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(102, 126, 234, 0.9);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-family: sans-serif;
    cursor: pointer;
    z-index: 10000;
    display: none;
  `;
  overlay.textContent = '🛡️ Verify';
  
  // Make parent position relative
  const parent = img.parentElement;
  if (parent && getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  
  // Show overlay on hover
  img.addEventListener('mouseenter', () => {
    overlay.style.display = 'block';
  });
  
  img.addEventListener('mouseleave', () => {
    overlay.style.display = 'none';
  });
  
  // Click to verify
  overlay.addEventListener('click', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    overlay.textContent = '⏳ Verifying...';
    
    // Send to background script for verification
    chrome.runtime.sendMessage({
      action: 'verifyImage',
      imageUrl: img.src
    }, (response) => {
      if (response && response.isDeepfake !== undefined) {
        if (response.isDeepfake) {
          overlay.textContent = '⚠️ Deepfake';
          overlay.style.background = 'rgba(239, 68, 68, 0.9)';
        } else {
          overlay.textContent = '✅ Authentic';
          overlay.style.background = 'rgba(16, 185, 129, 0.9)';
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
          overlay.textContent = '🛡️ Verify';
          overlay.style.background = 'rgba(102, 126, 234, 0.9)';
        }, 3000);
      }
    });
  });
  
  parent.appendChild(overlay);
}

// Auto-scan images on page load (optional)
function autoScanImages() {
  const images = getAllImages();
  
  if (images.length > 0) {
    console.log(`🛡️ ProofOf.ai: Found ${images.length} images to scan`);
    // Could auto-verify here if user has enabled it
  }
}

// Initialize
setTimeout(() => {
  addImageIndicators();
  autoScanImages();
}, 1000);

// Watch for new images added dynamically
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeName === 'IMG') {
        if (node.naturalWidth > 100 && node.naturalHeight > 100) {
          addScanOverlay(node);
        }
      } else if (node.querySelectorAll) {
        const newImages = node.querySelectorAll('img');
        newImages.forEach(img => {
          if (img.naturalWidth > 100 && img.naturalHeight > 100 && !img.dataset.proofofScanned) {
            addScanOverlay(img);
            img.dataset.proofofScanned = 'true';
          }
        });
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

