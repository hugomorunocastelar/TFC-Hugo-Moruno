import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function CoachTable({ currentCoaches, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Coaches</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>No License</th>
            <th>Level License</th>
            <th>Team</th>
            <th>Person</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCoaches.map(coach => (
            <tr key={coach.id}>
              <td>{coach.noLicense}</td>
              <td>{coach.lvlLicense}</td>
              <td>{coach.team ? coach.team.name : ''}</td>
              <td>{coach.dni ? `${coach.dni.name} ${coach.dni.surnames || ''}` : ''}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(coach)} />
                  <DeleteButton onClick={() => onDelete(coach.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentCoaches.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No coaches found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default CoachTable;
