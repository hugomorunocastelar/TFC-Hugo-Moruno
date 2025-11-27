import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function CompetitionTable({ currentCompetitions, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Competitions</h2>
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
          {currentCompetitions.map(comp => (
            <tr key={comp.id}>
              <td>{comp.name}</td>
              <td>{comp.dayStart ? comp.dayStart.split('T')[0] : ''}</td>
              <td>{comp.dayEnd ? comp.dayEnd.split('T')[0] : ''}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(comp)} />
                  <DeleteButton onClick={() => onDelete(comp.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentCompetitions.length === 0 && (
            <tr>
              <td colSpan="4" className='admin-no-data'>No competitions found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default CompetitionTable;
