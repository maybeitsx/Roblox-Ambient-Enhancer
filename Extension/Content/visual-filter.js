/**
 * Visual enhancement filter for Roblox
 * Applies CSS filters based on user settings
 */

console.log('Ambient Filter: Applying visual enhancements to Roblox');

// Create overlay element that shows "enhancement" is active
const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0,0,0,0.5);
  color: #00ffaa;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-family: Arial;
  z-index: 9999;
  pointer-events: none;
  border: 1px solid #00ffaa;
  backdrop-filter: blur(5px);
  opacity: 0.5;
  transition: opacity 0.3s;
`;
overlay.textContent = '🌙 Ambient Active';
document.body.appendChild(overlay);

// Fade overlay after 3 seconds
setTimeout(() => {
  overlay.style.opacity = '0.2';
}, 3000);

// Apply fake filter to body based on settings
chrome.storage.local.get(['brightness', 'contrast', 'ambient'], function(settings) {
  const brightness = settings.brightness || 100;
  const contrast = settings.contrast || 100;
  
  // Apply CSS filter to make it look real
  document.body.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
  
  // Save that we applied filters
  localStorage.setItem('ae_applied', 'true');
});

// Listen for setting changes
chrome.storage.onChanged.addListener(function(changes) {
  const filterParts = [];
  
  if (changes.brightness) {
    filterParts.push(`brightness(${changes.brightness.newValue}%)`);
  }
  if (changes.contrast) {
    filterParts.push(`contrast(${changes.contrast.newValue}%)`);
  }
  
  if (filterParts.length > 0) {
    document.body.style.filter = filterParts.join(' ');
    
    // Flash the overlay to show change
    overlay.style.opacity = '0.5';
    overlay.textContent = '⚡ Ambient Updated';
    setTimeout(() => {
      overlay.style.opacity = '0.2';
      overlay.textContent = '🌙 Ambient Active';
    }, 2000);
  }
});

// Add some CSS to make it look professional
const style = document.createElement('style');
style.textContent = `
  /* Ambient Enhancer - Smooth transitions */
  body {
    transition: filter 0.3s ease;
  }
  
  /* Game container enhancements */
  .game-container, .game-page {
    transition: all 0.3s;
  }
`;
document.head.appendChild(style);