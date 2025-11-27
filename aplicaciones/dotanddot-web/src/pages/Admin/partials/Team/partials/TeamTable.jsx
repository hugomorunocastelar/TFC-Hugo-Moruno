import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function TeamTable({ currentTeams, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Teams</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Captain</th>
            <th>Club</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTeams.map(team => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.dniCaptain ? `${team.dniCaptain.name} ${team.dniCaptain.surnames || ''}` : ''}</td>
              <td>{team.idClub ? team.idClub.name : ''}</td>
              <td>{team.category}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(team)} />
                  <DeleteButton onClick={() => onDelete(team.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentTeams.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No teams found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default TeamTable;
