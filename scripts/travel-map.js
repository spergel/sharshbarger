document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    initMap();
});

async function initMap() {
    // Initialize the map
    const map = L.map('map-container').setView([20, 0], 2);
    
    // Add the minimal basemap with only country outlines
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        subdomains: 'abcd',
        maxZoom: 18,
        bounds: [[-90, -180], [90, 180]],
        className: 'grayscale-tiles'
    }).addTo(map);

    // Add CSS to make tiles grayscale and very light
    const style = document.createElement('style');
    style.textContent = `
        .grayscale-tiles {
            filter: grayscale(100%) !important;
            opacity: 0.3 !important;
        }
    `;
    document.head.appendChild(style);

    try {
        // Load all necessary data
        const [visitedResponse, worldResponse, disputedResponse, usStatesResponse, turkeyProvincesResponse] = await Promise.all([
            fetch('/public/data/visited-countries.json'),
            fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'),
            fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_breakaway_disputed_areas.geojson'),
            fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'),
            fetch('/public/data/lvl1-TR.json')
        ]);

        const visitedData = await visitedResponse.json();
        const worldData = await worldResponse.json();
        const disputedData = await disputedResponse.json();
        const usStatesData = await usStatesResponse.json();
        const turkeyProvincesData = await turkeyProvincesResponse.json();
        
        // Update statistics
        document.getElementById('countries-count').textContent = visitedData.visited.length;
        
        // Create lookup sets
        const visitedCountryCodes = new Set(visitedData.visited.map(c => c.code));
        const visitedUSStates = new Set(
            visitedData.visited.find(c => c.code === "USA")?.regions || []
        );
        const visitedTurkeyProvinces = new Set(
            visitedData.visited.find(c => c.code === "TUR")?.regions || []
        );

        // Add world countries layer first
        L.geoJSON(worldData, {
            style: function(feature) {
                const isVisited = visitedCountryCodes.has(feature.properties.ISO_A3);
                return {
                    fillColor: isVisited ? '#90EE90' : '#ffffff',
                    weight: 1,
                    opacity: 1,
                    color: '#666',
                    fillOpacity: isVisited ? 0.5 : 0.1
                };
            },
            onEachFeature: function(feature, layer) {
                // For debugging
                console.log(`Country: ${feature.properties.ADMIN}, ISO: ${feature.properties.ISO_A3}`);
                layer.bindPopup(feature.properties.ADMIN);
            }
        }).addTo(map);

        // Add disputed areas layer on top
        L.geoJSON(disputedData, {
            filter: function(feature) {
                // Only show Western Sahara from disputed areas
                return feature.properties.BRK_NAME === "W. Sahara";
            },
            style: {
                fillColor: '#E9E9E9',  // white like other unvisited territories
                weight: 1,
                opacity: 1,
                color: '#666',
                fillOpacity: 1    // same opacity as other unvisited territories
            }
        }).addTo(map);

        // Add US States layer
        L.geoJSON(usStatesData, {
            style: function(feature) {
                const isVisited = visitedUSStates.has(feature.properties.postal) || 
                                 visitedUSStates.has(feature.properties.name);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`${feature.properties.name}, United States`);
            }
        }).addTo(map);

        // Add Turkey Provinces layer
        L.geoJSON(turkeyProvincesData, {
            style: function(feature) {
                const provinceName = feature.properties?.Name;
                const isVisited = visitedTurkeyProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.Name;
                layer.bindPopup(`${name}, Turkey`);
            }
        }).addTo(map);

        // Add legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML = `
                <div class="legend-item">
                    <span class="legend-color" style="background: #4CAF50;"></span>
                    Visited Region
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #90EE90;"></span>
                    Visited Country
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #ffffff; border: 1px solid #666;"></span>
                    Not Yet Visited
                </div>
            `;
            return div;
        };
        legend.addTo(map);
    } catch (error) {
        console.error('Error loading map data:', error);
    }
} 