import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function RefereeTable({ currentReferees, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Referees</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>No License</th>
            <th>Level License</th>
            <th>City</th>
            <th>Person</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReferees.map(referee => (
            <tr key={referee.id}>
              <td>{referee.noLicense}</td>
              <td>{referee.lvlLicense}</td>
              <td>{referee.city ? referee.city.name : ''}</td>
              <td>{referee.dni ? `${referee.dni.name} ${referee.dni.surnames || ''}` : ''}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(referee)} />
                  <DeleteButton onClick={() => onDelete(referee.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentReferees.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No referees found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default RefereeTable;
