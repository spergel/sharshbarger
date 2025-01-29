document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    initMap();
});

async function initMap() {
    // Initialize the map with noWrap option
    const map = L.map('map-container', {
        noWrap: true,
        maxBounds: [[-90, -180], [90, 180]],
        minZoom: 2
    }).setView([20, 0], 2);
    
    // Update the tile layer options
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
        const [visitedResponse, worldResponse, disputedResponse, usStatesResponse, 
               turkeyProvincesResponse, thailandProvincesResponse, vietnamProvincesResponse, 
               palestineResponse, russiaResponse, mexicoResponse, panamaResponse,
               nicaraguaResponse, peruResponse, spainResponse] = await Promise.all([
            fetch('/public/data/visited-countries.json'),
            fetch('/public/data/map.geojson'),
            fetch('/public/data/map2.geojson'),
            fetch('/public/data/usa.json'),
            fetch('/public/data/turkey.json'),
            fetch('/public/data/thailand.geojson'),
            fetch('/public/data/vietnam.json'),
            fetch('/public/data/palestine.geo.json'),
            fetch('/public/data/russia.json'),
            fetch('/public/data/mexico.json'),
            fetch('/public/data/panama.json'),
            fetch('/public/data/nicaragua.geojson'),
            fetch('/public/data/peru.geojson'),
            fetch('/public/data/spain.json')
        ]);

        const visitedData = await visitedResponse.json();
        const worldData = await worldResponse.json();
        const disputedData = await disputedResponse.json();
        const usStatesData = await usStatesResponse.json();
        const turkeyProvincesData = await turkeyProvincesResponse.json();
        const thailandProvincesData = await thailandProvincesResponse.json();
        const vietnamProvincesData = await vietnamProvincesResponse.json();
        const palestineData = await palestineResponse.json();
        const russiaData = await russiaResponse.json();
        const mexicoData = await mexicoResponse.json();
        const panamaData = await panamaResponse.json();
        const nicaraguaData = await nicaraguaResponse.json();
        const peruData = await peruResponse.json();
        const spainData = await spainResponse.json();
        
        // Update statistics
        document.getElementById('countries-count').textContent = visitedData.visited.length;
        
        // Create lookup sets
        const visitedCountryCodes = new Set(visitedData.visited.map(c => c.code));
        const visitedUSStates = new Set(
            visitedData.visited.find(c => c.code === "US1" || c.code === "USA")?.regions || []
        );
        const visitedTurkeyProvinces = new Set(
            visitedData.visited.find(c => c.code === "TUR")?.regions || []
        );
        const visitedThailandProvinces = new Set(
            visitedData.visited.find(c => c.code === "THA")?.regions || []
        );

        const visitedVietnamProvinces = new Set(
            visitedData.visited.find(c => c.code === "VNM")?.regions || []
        );

        const visitedRussiaProvinces = new Set(
            visitedData.visited.find(c => c.code === "RUS")?.regions || []
        );

        const visitedMexicoProvinces = new Set(
            visitedData.visited.find(c => c.code === "MEX")?.regions || []
        );

        const visitedPanamaProvinces = new Set(
            visitedData.visited.find(c => c.code === "PAN")?.regions || []
        );

        const visitedNicaraguaProvinces = new Set(
            visitedData.visited
                .find(country => country.code === 'NIC')
                ?.regions || []
        );

        const visitedPeruProvinces = new Set(
            visitedData.visited
                .find(country => country.code === 'PER')
                ?.regions || []
        );

        const visitedSpainProvinces = new Set(
            visitedData.visited
                .find(country => country.code === 'ESP')
                ?.regions || []
        );

        // Helper function to get province name from feature
        function getProvinceName(feature, countryCode) {
            switch(countryCode) {
                case 'RUS':
                case 'NIC':
                case 'PER':
                    return feature.properties?.shapeName;
                case 'ESP':
                case 'MEX':
                case 'PAN':
                    return feature.properties?.name;
                default:
                    return feature.properties?.name || feature.properties?.shapeName;
            }
        }

        // Add world countries layer first
        L.geoJSON(worldData, {
            style: function(feature) {
                const isVisited = visitedCountryCodes.has(feature.properties.SOV_A3) || 
                                 (feature.properties.SOV_A3 === "US1" && visitedCountryCodes.has("USA"));
                return {
                    fillColor: isVisited ? '#90EE90' : '#ffffff',
                    weight: 1,
                    opacity: 1,
                    color: '#666',
                    fillOpacity: isVisited ? 0.5 : 0.1
                };
            },
            onEachFeature: function(feature, layer) {
                // Only add popup if country has been visited
                if (visitedCountryCodes.has(feature.properties.SOV_A3)) {
                    layer.bindPopup(feature.properties.ADMIN);
                }
            }
        }).addTo(map);

        // // Add Syria's border separately if needed
        // L.geoJSON(worldData, {
        //     filter: function(feature) {
        //         // Only show Syria's border
        //         return feature.properties.SOV_A3 === "SYR";
        //     },
        //     style: {
        //         fillColor: '#ffffff',
        //         weight: 1,
        //         opacity: 1,
        //         color: '#666',
        //         fillOpacity: 0.1
        //     }
        // }).addTo(map);

        // Add disputed areas layer on top
        L.geoJSON(disputedData, {
            filter: function(feature) {
                // Filter out specific disputed territories
                if (feature.properties.SOVEREIGNT === "Georgia" || 
                    feature.properties.BRK_A3 === "C02" || 
                    feature.properties.BRK_A3 === "C03" ||
                    feature.properties.SOV_A3 === "IS1" ||
                    feature.properties.BRK_A3 === "B38" ) {  // Add this condition
                    return false;
                }
                return true;  // Show all other disputed territories
            },
            style: {
                fillColor: '#E9E9E9',
                weight: 1,
                opacity: 1,
                color: '#666',
                fillOpacity: 1
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

        // Add Thailand Provinces layer
        L.geoJSON(thailandProvincesData, {
            style: function(feature) {
                const provinceName = feature.properties?.shapeName;
                const isVisited = visitedThailandProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.shapeName;
                layer.bindPopup(`${name}, Thailand`);
            }
        }).addTo(map);

        // Add Vietnam Provinces layer
        L.geoJSON(vietnamProvincesData, {
            style: function(feature) {
                const provinceName = feature.properties?.shapeName;
                const isVisited = visitedVietnamProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.shapeName;
                layer.bindPopup(`${name}, Vietnam`);
            }
        }).addTo(map);

        // Add Palestine layer
        L.geoJSON(palestineData, {
            style: {
                fillColor: '#ffffff',
                weight: 1,
                opacity: 1,
                color: '#666',
                fillOpacity: 0.1
            }
        }).addTo(map);

        // Add Russia Provinces layer
        L.geoJSON(russiaData, {
            style: function(feature) {
                const provinceName = getProvinceName(feature, 'RUS');
                const isVisited = visitedRussiaProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = getProvinceName(feature, 'RUS');
                layer.bindPopup(`${name}, Russia`);
            }
        }).addTo(map);

        // Add Mexico Provinces layer
        L.geoJSON(mexicoData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedMexicoProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Mexico`);
            }
        }).addTo(map);

        // Add Panama Provinces layer
        L.geoJSON(panamaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedPanamaProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Panama`);
            }
        }).addTo(map);

        // Add Peru Provinces layer
        L.geoJSON(peruData, {
            style: function(feature) {
                const provinceName = feature.properties?.shapeName;
                const isVisited = visitedPeruProvinces.has(provinceName);
                console.log(`Peru Province: ${provinceName}, Visited: ${isVisited}`); // Debug log
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.shapeName;
                layer.bindPopup(`${name}, Peru`);
            }
        }).addTo(map);

        // Add Spain Provinces layer
        L.geoJSON(spainData, {
            style: function(feature) {
                const provinceId = feature.properties?.id;
                const isVisited = visitedSpainProvinces.has(provinceId);
                console.log(`Spain Province ID: ${provinceId}, Visited: ${isVisited}`); // Debug log
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Spain`);
            }
        }).addTo(map);

        // Add Nicaragua layer
        L.geoJSON(nicaraguaData, {
            style: function(feature) {
                const provinceName = feature.properties?.shapeName;
                const isVisited = visitedNicaraguaProvinces.has(provinceName);
                console.log(`Nicaragua Province: ${provinceName}, Visited: ${isVisited}`); // Debug log
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.shapeName;
                layer.bindPopup(`${name}, Nicaragua`);
            }
        }).addTo(map);

        // Add legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML = `
                <div class="legend-item">
                    <span class="legend-color" style="background: #4CAF50;"></span>
                    Visited region
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #90EE90;"></span>
                    Visited country
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #ffffff; border: 1px solid #666;"></span>
                    Not yet visited
                </div>
            `;
            return div;
        };
        legend.addTo(map);
    } catch (error) {
        console.error('Error loading map data:', error);
    }
} 