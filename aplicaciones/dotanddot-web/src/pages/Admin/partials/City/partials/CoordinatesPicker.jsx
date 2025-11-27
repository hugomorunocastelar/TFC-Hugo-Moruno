import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import './CoordinatesPicker.css';

function CoordinatesPicker({ latitude, longitude, onCoordinatesChange, cityName }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch('/src/assets/extremaduramap/extremadura.geojson')
            .then(response => response.json())
            .then(data => setGeoData(data))
            .catch(error => console.error('Error loading GeoJSON:', error));
    }, []);

    // Buscar coordenadas usando Nominatim (OpenStreetMap)
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const query = cityName ? `${searchQuery}, ${cityName}, Extremadura, Spain` : `${searchQuery}, Extremadura, Spain`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=es`,
                {
                    headers: {
                        'Accept-Language': 'es',
                    }
                }
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching location:', error);
            alert('Error al buscar la ubicación');
        } finally {
            setSearching(false);
        }
    };

    const handleSelectResult = (result) => {
        onCoordinatesChange({
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon)
        });
        setSearchResults([]);
        setSearchQuery('');
        setShowMap(true);
    };

    const handleGeographyClick = () => {
        return (event) => {
            event.preventDefault();

            const svg = event.currentTarget.closest('svg');
            if (!svg) return;

            const rect = svg.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Normalizar a 0-1
            const normX = x / rect.width;
            const normY = y / rect.height;

            // Límites reales de Extremadura ajustados empíricamente
            const bounds = {
                minLon: -7.6,
                maxLon: -4.6,
                minLat: 37.9,
                maxLat: 40.5
            };
            
            // Conversión directa lineal de píxeles a coordenadas
            // Sin considerar zoom ya que ZoomableGroup lo maneja internamente
            const lon = bounds.minLon + (normX * (bounds.maxLon - bounds.minLon));
            const lat = bounds.maxLat - (normY * (bounds.maxLat - bounds.minLat));

            // Validar límites
            if (lon >= bounds.minLon && lon <= bounds.maxLon && lat >= bounds.minLat && lat <= bounds.maxLat) {
                onCoordinatesChange({
                    latitude: lat,
                    longitude: lon
                });
            }
        };
    };

    return (
        <div className='coordinates-picker'>
            <div className='coordinates-inputs'>
                <label>
                    <span>Latitude*</span>
                    <input
                        type="number"
                        step="0.000001"
                        value={latitude || ''}
                        onChange={(e) => onCoordinatesChange({ latitude: parseFloat(e.target.value), longitude })}
                        placeholder="38.8794"
                        required
                    />
                </label>
                <label>
                    <span>Longitude*</span>
                    <input
                        type="number"
                        step="0.000001"
                        value={longitude || ''}
                        onChange={(e) => onCoordinatesChange({ latitude, longitude: parseFloat(e.target.value) })}
                        placeholder="-6.9706"
                        required
                    />
                </label>
            </div>

            <div className='coordinates-search'>
                <div className='search-input-group'>
                    <input
                        type="text"
                        placeholder="Buscar dirección o lugar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={searching}
                        className='search-button'
                    >
                        {searching ? 'Buscando...' : '🔍 Buscar'}
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className='search-results'>
                        {searchResults.map((result, index) => (
                            <div
                                key={index}
                                className='search-result-item'
                                onClick={() => handleSelectResult(result)}
                            >
                                <div className='result-name'>{result.display_name}</div>
                                <div className='result-coords'>
                                    {parseFloat(result.lat).toFixed(6)}, {parseFloat(result.lon).toFixed(6)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="button"
                className='toggle-map-button'
                onClick={() => setShowMap(!showMap)}
            >
                {showMap ? '📍 Ocultar mapa' : '🗺️ Seleccionar en mapa'}
            </button>

            {showMap && geoData && (
                <div className='map-container'>
                    <p className='map-hint'>Haz clic en el mapa para seleccionar las coordenadas</p>
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 14000,
                            center: [-6.0, 39.2]
                        }}
                        width={800}
                        height={900}
                        style={{ width: '100%', height: 'auto' }}
                    >
                        <Geographies geography={geoData}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#E0E0E0"
                                            stroke="#FFFFFF"
                                            strokeWidth={0.5}
                                            onClick={handleGeographyClick()}
                                            style={{
                                                default: { outline: 'none', cursor: 'crosshair' },
                                                hover: { fill: '#CFD8DC', outline: 'none', cursor: 'crosshair' },
                                                pressed: { fill: '#90A4AE', outline: 'none', cursor: 'crosshair' },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            {latitude && longitude && (
                                <Marker coordinates={[longitude, latitude]}>
                                    <circle r={8} fill="#007bff" stroke="#fff" strokeWidth={2} />
                                    <text
                                        textAnchor="middle"
                                        y={-15}
                                        style={{ fontSize: 14, fontWeight: 'bold', fill: '#007bff' }}
                                    >
                                        📍
                                    </text>
                                </Marker>
                            )}
                    </ComposableMap>
                </div>
            )}

            {latitude && longitude && (
                <div className='coordinates-preview'>
                    ✓ Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </div>
            )}
        </div>
    );
}

export default CoordinatesPicker;
