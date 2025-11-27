import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function SeasonsTable({ currentSeasons, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Seasons</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSeasons.map(season => (
            <tr key={season.id}>
              <td>{season.name}</td>
              <td>{season.startDate ? season.startDate.substring(0,10) : ''}</td>
              <td>{season.endDate ? season.endDate.substring(0,10) : ''}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(season)} />
                  <DeleteButton onClick={() => onDelete(season.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentSeasons.length === 0 && (
            <tr>
              <td colSpan="4" className='admin-no-data'>No seasons found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default SeasonsTable;
