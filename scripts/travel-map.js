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

    // Only add styles if in browser environment
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
            .grayscale-tiles {
                filter: grayscale(100%) !important;
                opacity: 0.3 !important;
            }
        `;
        document.head.appendChild(style);
    }

    try {
        // Load all necessary data
        const [visitedResponse, worldResponse, disputedResponse, usStatesResponse, 
               turkeyProvincesResponse, thailandProvincesResponse, vietnamProvincesResponse, 
               palestineResponse, russiaResponse, mexicoResponse, panamaResponse,
               nicaraguaResponse, peruResponse, spainResponse, germanyResponse, 
               austriaResponse, boliviaResponse, brazilResponse, bulgariaResponse, 
               croatiaResponse, egyptResponse, estoniaResponse, 
               finlandResponse, franceResponse, britainResponse, italyResponse, 
               japanResponse, jordanResponse, netherlandsResponse, saudiResponse, 
               uzbekistanResponse, swedenResponse, costaRicaResponse,
               guatemalaResponse, georgiaResponse, greeceResponse, portugalResponse,
               armeniaResponse, lebanonResponse, slovakiaResponse, ukraineResponse, moldovaResponse] = await Promise.all([
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
            fetch('/public/data/spain.json'),
            fetch('/public/data/germany.json'),
            fetch('/public/data/austria.json'),
            fetch('/public/data/bolivia.json'),
            fetch('/public/data/brazil.json'),
            fetch('/public/data/bulgaria.json'),
            fetch('/public/data/croatia.json'),
            fetch('/public/data/egypt.json'),
            fetch('/public/data/estonia.json'),
            fetch('/public/data/finland.json'),
            fetch('/public/data/france.json'),
            fetch('/public/data/great_britain.json'),
            fetch('/public/data/italy.json'),
            fetch('/public/data/japan.json'),
            fetch('/public/data/jordan.json'),
            fetch('/public/data/netherlands.json'),
            fetch('/public/data/saudi_arabia.json'),
            fetch('/public/data/uzbekistan.json'),
            fetch('/public/data/sweden.json'),
            fetch('/public/data/costa_rica.json'),
            fetch('/public/data/guatemala.json'),
            fetch('/public/data/georgia.json'),
            fetch('/public/data/greece.geojson'),
            fetch('/public/data/portugal.json'),
            fetch('/public/data/armenia.json'),
            fetch('/public/data/lebanon.geojson'),
            fetch('/public/data/slovakia.json'),
            fetch('/public/data/ukraine.json'),
            fetch('/public/data/moldova.json')
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
        const germanyData = await germanyResponse.json();
        const austriaData = await austriaResponse.json();
        const boliviaData = await boliviaResponse.json();
        const brazilData = await brazilResponse.json();
        const bulgariaData = await bulgariaResponse.json();
        const croatiaData = await croatiaResponse.json();
        const egyptData = await egyptResponse.json();
        const estoniaData = await estoniaResponse.json();
        const finlandData = await finlandResponse.json();
        const franceData = await franceResponse.json();
        const britainData = await britainResponse.json();
        const italyData = await italyResponse.json();
        const japanData = await japanResponse.json();
        const jordanData = await jordanResponse.json();
        const netherlandsData = await netherlandsResponse.json();
        const saudiData = await saudiResponse.json();
        const uzbekistanData = await uzbekistanResponse.json();
        const swedenData = await swedenResponse.json();
        const costaRicaData = await costaRicaResponse.json();
        const guatemalaData = await guatemalaResponse.json();
        const georgiaData = await georgiaResponse.json();
        const greeceData = await greeceResponse.json();
        const portugalData = await portugalResponse.json();
        const armeniaData = await armeniaResponse.json();
        const lebanonData = await lebanonResponse.json();
        const slovakiaData = await slovakiaResponse.json();
        const ukraineData = await ukraineResponse.json();
        const moldovaData = await moldovaResponse.json();
        
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

        const visitedGermanyProvinces = new Set(
            visitedData.visited
                .find(country => country.code === 'DEU')
                ?.regions || []
        );

        const visitedAustriaProvinces = new Set(
            visitedData.visited.find(c => c.code === "AUT")?.regions || []
        );
        const visitedBoliviaProvinces = new Set(
            visitedData.visited.find(c => c.code === "BOL")?.regions || []
        );
        const visitedBrazilProvinces = new Set(
            visitedData.visited.find(c => c.code === "BRA")?.regions || []
        );
        const visitedBulgariaProvinces = new Set(
            visitedData.visited.find(c => c.code === "BGR")?.regions || []
        );
        const visitedCroatiaProvinces = new Set(
            visitedData.visited.find(c => c.code === "HRV")?.regions || []
        );
        const visitedEgyptProvinces = new Set(
            visitedData.visited.find(c => c.code === "EGY")?.regions || []
        );
        const visitedEstoniaProvinces = new Set(
            visitedData.visited.find(c => c.code === "EST")?.regions || []
        );
        const visitedFinlandProvinces = new Set(
            visitedData.visited.find(c => c.code === "FIN")?.regions || []
        );
        const visitedFranceProvinces = new Set(
            visitedData.visited.find(c => c.code === "FRA")?.regions || []
        );
        const visitedBritainProvinces = new Set(
            visitedData.visited.find(c => c.code === "GBR")?.regions || []
        );
        const visitedItalyProvinces = new Set(
            visitedData.visited.find(c => c.code === "ITA")?.regions || []
        );
        const visitedJapanProvinces = new Set(
            visitedData.visited.find(c => c.code === "JPN")?.regions || []
        );
        const visitedJordanProvinces = new Set(
            visitedData.visited.find(c => c.code === "JOR")?.regions || []
        );
        const visitedNetherlandsProvinces = new Set(
            visitedData.visited.find(c => c.code === "NLD")?.regions || []
        );
        const visitedSaudiProvinces = new Set(
            visitedData.visited.find(c => c.code === "SAU")?.regions || []
        );
        const visitedUzbekistanProvinces = new Set(
            visitedData.visited.find(c => c.code === "UZB")?.regions || []
        );
        const visitedSwedenProvinces = new Set(
            visitedData.visited.find(c => c.code === "SWE")?.regions || []
        );
        const visitedCostaRicaProvinces = new Set(
            visitedData.visited.find(c => c.code === "CRI")?.regions || []
        );
        const visitedGuatemalaProvinces = new Set(
            visitedData.visited.find(c => c.code === "GTM")?.regions || []
        );
        const visitedGeorgiaProvinces = new Set(
            visitedData.visited.find(c => c.code === "GEO")?.regions || []
        );
        const visitedArmeniaProvinces = new Set(
            visitedData.visited.find(c => c.code === "ARM")?.regions || []
        );
        const visitedLebanonProvinces = new Set(
            visitedData.visited.find(c => c.code === "LBN")?.regions || []
        );
        const visitedGreeceProvinces = new Set(
            visitedData.visited.find(c => c.code === "GRC")?.regions || []
        );
        const visitedPortugalProvinces = new Set(
            visitedData.visited.find(c => c.code === "PRT")?.regions || []
        );
        const visitedSlovakiaProvinces = new Set(
            visitedData.visited.find(c => c.code === "SVK")?.regions || []
        );
        const visitedUkraineProvinces = new Set(
            visitedData.visited.find(c => c.code === "UKR")?.regions || []
        );
        const visitedMoldovaProvinces = new Set(
            visitedData.visited.find(c => c.code === "MDA")?.regions || []
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
                    feature.properties.BRK_A3 === "B38" ||
                    feature.properties.BRK_A3 === "B20" ||
                    feature.properties.BRK_A3 === "C43") {
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

        // Add Germany Provinces layer
        L.geoJSON(germanyData, {
            style: function(feature) {
                const provinceName = feature.properties?.name_1;
                const isVisited = visitedGermanyProvinces.has(provinceName);
                
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name_1;
                layer.bindPopup(`${name}, Germany`);
            }
        }).addTo(map);

        // Add Austria Provinces layer
        L.geoJSON(austriaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedAustriaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Austria`);
            }
        }).addTo(map);

        // Add Bolivia Provinces layer
        L.geoJSON(boliviaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedBoliviaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Bolivia`);
            }
        }).addTo(map);

        // Add Brazil Provinces layer
        L.geoJSON(brazilData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedBrazilProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Brazil`);
            }
        }).addTo(map);

        // Add Bulgaria Provinces layer
        L.geoJSON(bulgariaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedBulgariaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Bulgaria`);
            }
        }).addTo(map);

        // Add Croatia Provinces layer
        L.geoJSON(croatiaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedCroatiaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Croatia`);
            }
        }).addTo(map);

        // Add Egypt Provinces layer
        L.geoJSON(egyptData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedEgyptProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Egypt`);
            }
        }).addTo(map);

        // Add Estonia Provinces layer
        L.geoJSON(estoniaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedEstoniaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Estonia`);
            }
        }).addTo(map);

        // Add Finland Provinces layer
        L.geoJSON(finlandData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedFinlandProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Finland`);
            }
        }).addTo(map);

        // Add France Provinces layer
        L.geoJSON(franceData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedFranceProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, France`);
            }
        }).addTo(map);

        // Add Great Britain Provinces layer
        L.geoJSON(britainData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedBritainProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Great Britain`);
            }
        }).addTo(map);

        // Add Italy Provinces layer
        L.geoJSON(italyData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedItalyProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Italy`);
            }
        }).addTo(map);

        // Add Japan Provinces layer
        L.geoJSON(japanData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedJapanProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Japan`);
            }
        }).addTo(map);

        // Add Jordan Provinces layer
        L.geoJSON(jordanData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedJordanProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Jordan`);
            }
        }).addTo(map);

        // Add Netherlands Provinces layer
        L.geoJSON(netherlandsData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedNetherlandsProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Netherlands`);
            }
        }).addTo(map);

        // Add Saudi Arabia Provinces layer
        L.geoJSON(saudiData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedSaudiProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Saudi Arabia`);
            }
        }).addTo(map);

        // Add Uzbekistan Provinces layer
        L.geoJSON(uzbekistanData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedUzbekistanProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Uzbekistan`);
            }
        }).addTo(map);

        // Add Sweden Provinces layer
        L.geoJSON(swedenData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedSwedenProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Sweden`);
            }
        }).addTo(map);

        // Add Costa Rica Provinces layer
        L.geoJSON(costaRicaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedCostaRicaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Costa Rica`);
            }
        }).addTo(map);

        // Add Guatemala Provinces layer
        L.geoJSON(guatemalaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedGuatemalaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Guatemala`);
            }
        }).addTo(map);

        // Add Georgia Provinces layer
        L.geoJSON(georgiaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedGeorgiaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Georgia`);
            }
        }).addTo(map);

        // Add Armenia Provinces layer
        L.geoJSON(armeniaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedArmeniaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Armenia`);
            }
        }).addTo(map);

        // Add Lebanon Provinces layer
        L.geoJSON(lebanonData, {
            style: function(feature) {
                const provinceName = feature.properties?.shapeName;
                const isVisited = visitedLebanonProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.shapeName;
                layer.bindPopup(`${name}, Lebanon`);
            }
        }).addTo(map);

        // Add Greece Provinces layer
        L.geoJSON(greeceData, {
            style: function(feature) {
                const provinceName = feature.properties?.shapeName;
                const isVisited = visitedGreeceProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.shapeName;
                layer.bindPopup(`${name}, Greece`);
            }
        }).addTo(map);

        // Add Portugal Provinces layer
        L.geoJSON(portugalData, {
            style: function(feature) {
                const provinceName = feature.properties?.id;
                const isVisited = visitedPortugalProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Portugal`);
            }
        }).addTo(map);

        // Add Slovakia Provinces layer
        L.geoJSON(slovakiaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedSlovakiaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                layer.bindPopup(`${name}, Slovakia`);
            }
        }).addTo(map);

        // Add Ukraine Provinces layer
        L.geoJSON(ukraineData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedUkraineProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                const displayName = name === 'Crimea, Ukraine' ? 'Crimea' : name;
                layer.bindPopup(`${displayName}`);
            }
        }).addTo(map);

        // Add Moldova Provinces layer
        L.geoJSON(moldovaData, {
            style: function(feature) {
                const provinceName = feature.properties?.name;
                const isVisited = visitedMoldovaProvinces.has(provinceName);
                return {
                    fillColor: '#4CAF50',
                    fillOpacity: isVisited ? 0.7 : 0,
                    weight: isVisited ? 2 : 0,
                    color: '#2E7D32'
                };
            },
            onEachFeature: function(feature, layer) {
                const name = feature.properties?.name;
                const displayName = name === 'Transnistria, Moldova' ? 'Pridnestrovie' : name;
                layer.bindPopup(`${displayName}`);
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