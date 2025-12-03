import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { extremaduraGeoData } from '../../../../../../js/extremaduraMap.mjs';
import './ClubView.css';
import { findClub } from '../../../../../../js/cruds/clubs.mjs';

function ClubView() {
  const { id } = useParams();
  const [club, setClub] = useState({});

  useEffect(() => {
    findClub(id)
    .then((response) => {
      console.log('Club data:', response);
      setClub(response)
    })
  }, [id]);

  const latitude = club.idCity?.latitude || 39.2;
  const longitude = club.idCity?.longitude || -6.0;

  return (
    <div className="clubview-container">
      <div className="clubview-card">
        <h2 className="clubview-title">{club.name}</h2>
        <div className="clubview-content">
          <div className="clubview-map-section">
            <h3>Location</h3>
            <div className="clubview-map">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [longitude, latitude],
                  scale: 6000
                }}
                width={800}
                height={350}
              >
                <Geographies geography={extremaduraGeoData}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#D6D6DA"
                          stroke="#FFFFFF"
                          strokeWidth={0.5}
                        />
                      ))
                    }
                  </Geographies>
                  {latitude && longitude && (
                    <Marker coordinates={[longitude, latitude]}>
                      <circle r={6} fill="var(--color-palette-green-4)" stroke="#fff" strokeWidth={2} />
                    </Marker>
                  )}
                </ComposableMap>
              </div>
            <p className="clubview-city"><strong>City:</strong> {club.idCity?.name}</p>
          </div>

          {club.contact && (
            <div className="clubview-contact-section">
              <h3>Contact Information</h3>
              <div className="clubview-contact-grid">
                {club.contact.directorName && (
                  <div className="clubview-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                    <div>
                      <span className="clubview-label">Director</span>
                      <span className="clubview-value">{club.contact.directorName}</span>
                    </div>
                  </div>
                )}
                {club.contact.email && (
                  <div className="clubview-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                    </svg>
                    <div>
                      <span className="clubview-label">Email</span>
                      <a href={`mailto:${club.contact.email}`} className="clubview-value clubview-link">{club.contact.email}</a>
                    </div>
                  </div>
                )}
                {club.contact.phone && (
                  <div className="clubview-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/>
                    </svg>
                    <div>
                      <span className="clubview-label">Phone</span>
                      <a href={`tel:${club.contact.phone}`} className="clubview-value clubview-link">{club.contact.phone}</a>
                    </div>
                  </div>
                )}
                {club.contact.website && (
                  <div className="clubview-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h3.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                    </svg>
                    <div>
                      <span className="clubview-label">Web</span>
                      <a href={club.contact.website} target="_blank" rel="noopener noreferrer" className="clubview-value clubview-link">{club.contact.website}</a>
                    </div>
                  </div>
                )}
                {club.contact.foundedYear && (
                  <div className="clubview-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                    </svg>
                    <div>
                      <span className="clubview-label">Founded</span>
                      <span className="clubview-value">{club.contact.foundedYear}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubView;
