import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';
import './GameTable.css';

function GameTable({ currentGames, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getStatusBadge = (game) => {
    if (game.finished) return <span className="badge badge-finished">Finished</span>;
    if (game.playing) return <span className="badge badge-playing">Playing</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  return (
    <div className='game-table-container'>
      <div className='game-table-header'>
        <h2>Match Management</h2>
        <NewButton onClick={onNew} />
      </div>

      <div className='game-table-wrapper'>
        <table className='game-table'>
          <thead>
            <tr>
              <th>Code</th>
              <th>League</th>
              <th>Category</th>
              <th>Home</th>
              <th>Away</th>
              <th>Date</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentGames.map(game => (
              <tr key={game.id}>
                <td className='game-code'>{game.uniqueCode || 'No code'}</td>
                <td>{game.league?.name || 'No league'}</td>
                <td>{game.details?.category?.replace('_', ' ') || 'N/A'}</td>
                <td className='team-name'>
                  {game.initialSituation?.localTeam?.name || 'No team'}
                </td>
                <td className='team-name'>
                  {game.initialSituation?.visitTeam?.name || 'No team'}
                </td>
                <td>{formatDate(game.details?.date)}</td>
                <td>{game.details?.city?.name || 'N/A'}</td>
                <td>{getStatusBadge(game)}</td>
                <td className='game-actions'>
                  <EditButton onClick={() => onEdit(game)} />
                  <DeleteButton onClick={() => onDelete(game.id)} />
                </td>
              </tr>
            ))}
            {currentGames.length === 0 && (
              <tr>
                <td colSpan="9" className='no-data'>No matches found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default GameTable;
