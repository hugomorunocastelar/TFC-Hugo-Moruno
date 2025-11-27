import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function CityTable({ currentCities, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Cities</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>First PC</th>
              <th>Last PC</th>
              <th>Coordinates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCities.map(city => (
              <tr key={city.id}>
                <td>{city.name}</td>
                <td>{city.region}</td>
                <td>{city.firstPC}</td>
                <td>{city.lastPC}</td>
                <td>
                  {city.latitude && city.longitude ? (
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      📍 {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
                    </span>
                  ) : (
                    <span style={{ color: '#6c757d', fontStyle: 'italic' }}>-</span>
                  )}
                </td>
                <td>
                  <div className='admin-table-actions'>
                    <EditButton onClick={() => onEdit(city)} />
                    <DeleteButton onClick={() => onDelete(city.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {currentCities.length === 0 && (
              <tr>
                <td colSpan="6" className='admin-no-data'>No cities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default CityTable;
