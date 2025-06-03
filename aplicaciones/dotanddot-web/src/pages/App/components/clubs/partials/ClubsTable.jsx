import React, { useState, useMemo } from 'react';
import './ClubsTable.css';
import { useNavigate } from 'react-router-dom';

function ClubsTable({ clubs }) {
  const [sortConfig, setSortConfig] = useState({ key: 'id', ascending: true });
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const filteredClubs = useMemo(() => {
    const query = filter.toLowerCase();
    return clubs.filter((club) => {
      const name = club.name?.toLowerCase() || '';
      const city = club.idCity?.name?.toLowerCase() || '';
      return name.includes(query) || city.includes(query);
    });
  }, [clubs, filter]);

  const sortedClubs = useMemo(() => {
    return [...filteredClubs].sort((a, b) => {
      const getValue = (club, key) => {
        if (key === 'city') return club.idCity?.name || '';
        return club[key] ?? '';
      };

      const valA = getValue(a, sortConfig.key);
      const valB = getValue(b, sortConfig.key);

      if (typeof valA === 'string') {
        const aStr = valA.toLowerCase();
        const bStr = valB.toLowerCase();
        if (aStr < bStr) return sortConfig.ascending ? -1 : 1;
        if (aStr > bStr) return sortConfig.ascending ? 1 : -1;
      } else {
        if (valA < valB) return sortConfig.ascending ? -1 : 1;
        if (valA > valB) return sortConfig.ascending ? 1 : -1;
      }

      return 0;
    });
  }, [filteredClubs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.ascending ? ' ▲' : ' ▼';
  };

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  const openClubView = (club) => {
    navigate(`/clubs/${club.id}`);
  }

  return (
    <div className="clubs-container">
      <div className="infoPanel clubs-card">
        <div className="clubs-search">
          <h2 className="clubs-title">Clubs</h2>
          <input
            type="text"
            placeholder="Search by name or city..."
            value={filter}
            onChange={handleChange}
          />
        </div>
        <table className="clubs-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID{getArrow('id')}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name{getArrow('name')}
              </th>
              <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                City{getArrow('city')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedClubs.map((club) => (
              <tr key={club.id} onClick={() => openClubView(club)}>
                <td>{club.id}</td>
                <td>{club.name}</td>
                <td>{club.idCity?.name ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClubsTable;
