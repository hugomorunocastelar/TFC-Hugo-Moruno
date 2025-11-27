import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function ClubsTable({ currentClubs, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Clubs</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClubs.map(club => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>{club.idCity?.name || ''}</td>
                <td>
                  <div className='admin-table-actions'>
                    <EditButton onClick={() => onEdit(club)} />
                    <DeleteButton onClick={() => onDelete(club.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {currentClubs.length === 0 && (
              <tr>
                <td colSpan="3" className='admin-no-data'>No clubs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default ClubsTable;
