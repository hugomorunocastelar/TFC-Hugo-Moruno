import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function GameplaceTable({ currentGameplaces, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Gameplaces</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gamefields</th>
            <th>Address</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentGameplaces.map(gp => (
            <tr key={gp.id}>
              <td>{gp.name}</td>
              <td>{gp.gamefields}</td>
              <td>{gp.address}</td>
              <td>{gp.idCity ? gp.idCity.name : ''}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(gp)} />
                  <DeleteButton onClick={() => onDelete(gp.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentGameplaces.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No gameplaces found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default GameplaceTable;
