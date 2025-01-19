// Store your GeoJSON and visited data in the worker
const VISITED_DATA = { /* your visited-countries.json content */ };
const GEOJSON_DATA = {
  world: { /* world.geojson content */ },
  disputed: { /* disputed.geojson content */ },
  usa: { /* usa.json content */ },
  turkey: { /* turkey.json content */ },
  thailand: { /* thailand.geojson content */ },
  vietnam: { /* vietnam.json content */ },
  palestine: { /* palestine.geo.json content */ },
  russia: { /* russia.geojson content */ },
  mexico: { /* mexico.json content */ },
  panama: { /* panama.json content */ },
  nicaragua: { /* nicaragua.geojson content */ },
  peru: { /* peru.geojson content */ },
  spain: { /* spain.json content */ }
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://yourdomain.com', // Replace with your domain
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  // Create a combined response with all necessary data
  const responseData = {
    visited: VISITED_DATA,
    geojson: GEOJSON_DATA
  };

  return new Response(JSON.stringify(responseData), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
} 