import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { extremaduraGeoData } from '../../../../../js/extremaduraMap.mjs';
import './ExtremaduraMap.css';

function ExtremaduraMap({ clubs }) {
  const initialCenter = [-6.0, 39.2];
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1.2);
  const [center, setCenter] = useState(initialCenter);
  
  const citiesWithCoords = useMemo(() => {
    const cityMap = new Map();
    clubs.forEach(club => {
      const city = club.idCity;
      if (city && city.latitude && city.longitude && !cityMap.has(city.id)) {
        cityMap.set(city.id, city);
      }
    });
    return Array.from(cityMap.values());
  }, [clubs]);

  const clubsPerCity = useMemo(() => {
    const grouped = {};
    clubs.forEach(club => {
      if (club.idCity?.id) {
        if (!grouped[club.idCity.id]) {
          grouped[club.idCity.id] = [];
        }
        grouped[club.idCity.id].push(club);
      }
    });
    return grouped;
  }, [clubs]);

  return (
    <div className="extremadura-map-container">
      <h3 className="extremadura-map-title">Map of Extremadura Clubs</h3>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4500,
          center: initialCenter
        }}
        className="extremadura-map-svg"
      >
        <ZoomableGroup 
          center={center} 
          zoom={zoom}
          onMoveEnd={(position) => {
            setZoom(position.zoom);
            setCenter(position.coordinates);
          }}
          minZoom={1.2}
          maxZoom={20}
          translateExtent={[
            [-100, -100],
            [900, 700]
          ]}
        >
          <Geographies geography={extremaduraGeoData}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E8E8E8"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: "#D8D8D8", outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>
          
          {citiesWithCoords.map(city => {
            const cityClubs = clubsPerCity[city.id] || [];
            const clubCount = cityClubs.length;
            const markerSize = (clubCount > 0 ? 4 + (clubCount * 0.5) : 3) / zoom;
            const showClubDetails = zoom >= 2.8;
            
            return (
              <Marker key={city.id} coordinates={[city.longitude, city.latitude]}>
                <g>
                  <circle
                    r={markerSize}
                    fill={clubCount > 0 ? "#FF5533" : "#999"}
                    stroke="#fff"
                    strokeWidth={0.8 / zoom}
                    className="city-marker"
                  />
                  <text
                    textAnchor="middle"
                    y={-markerSize - 2}
                    className="city-marker-text"
                    style={{
                      fontSize: `${9 / zoom}px`,
                      fontWeight: clubCount > 0 ? 'bold' : 'normal'
                    }}
                  >
                    {city.name}
                    {clubCount > 0 && ` (${clubCount})`}
                  </text>
                  
                  {showClubDetails && cityClubs.length > 0 && (
                    <g>
                      {cityClubs.map((club, index) => {
                        const yOffset = markerSize * zoom + 10 + (index * 18);
                        return (
                          <g 
                            key={club.id}
                            className="club-item"
                            onClick={() => navigate(`/clubs/${club.id}`)}
                          >
                            <rect
                              x={-3 / zoom}
                              y={(yOffset - 7) / zoom}
                              width={100 / zoom}
                              height={12 / zoom}
                              className="club-item-background"
                              rx={2 / zoom}
                            />
                            <circle
                              cx={0}
                              cy={yOffset / zoom}
                              r={5 / zoom}
                              className="club-item-circle"
                              strokeWidth={1 / zoom}
                            />
                            <text
                              x={8 / zoom}
                              y={(yOffset + 3) / zoom}
                              className="club-item-text"
                              style={{
                                fontSize: `${8 / zoom}px`
                              }}
                            >
                              {club.name}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      <div className="extremadura-map-legend">
        <p>🔴 Cities with clubs (size indicates number of clubs)</p>
      </div>
    </div>
  );
}

export default ExtremaduraMap;
