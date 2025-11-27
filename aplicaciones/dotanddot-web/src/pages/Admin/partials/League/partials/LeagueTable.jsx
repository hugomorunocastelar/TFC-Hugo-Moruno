import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function LeagueTable({ currentLeagues, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Leagues</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Competition</th>
            <th>Code Prefix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLeagues.map(league => (
            <tr key={league.id}>
              <td>{league.name}</td>
              <td>{league.category}</td>
              <td>{league.competition ? league.competition.name : ''}</td>
              <td>{league.codePrefix}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(league)} />
                  <DeleteButton onClick={() => onDelete(league.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentLeagues.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No leagues found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default LeagueTable;
