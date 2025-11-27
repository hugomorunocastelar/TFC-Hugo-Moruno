import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function PersonTable({ currentPersons, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Persons</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Name</th>
            <th>Surnames</th>
            <th>DNI Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPersons.map(person => (
            <tr key={person.id}>
              <td>{person.dni}</td>
              <td>{person.name}</td>
              <td>{person.surnames}</td>
              <td>{person.dniVerified ? 'Yes' : 'No'}</td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(person)} />
                  <DeleteButton onClick={() => onDelete(person.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentPersons.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No persons found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default PersonTable;
