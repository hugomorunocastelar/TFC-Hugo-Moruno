import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function PlayerTable({ currentPlayers, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Players</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>No Shirt</th>
            <th>Team</th>
            <th>Person</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPlayers.map(player => (
            <tr key={player.id}>
              <td>{player.noShirt}</td>
              <td>{player.team ? player.team.name : ''}</td>
              <td>{player.dni ? `${player.dni.name} ${player.dni.surnames || ''}` : ''}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(player)} />
                  <DeleteButton onClick={() => onDelete(player.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentPlayers.length === 0 && (
            <tr>
              <td colSpan="4" className='admin-no-data'>No players found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default PlayerTable;
