import React from 'react';
import NewButton from '../../../components/buttons/new/NewButton';
import EditButton from '../../../components/buttons/edit/EditButton';
import DeleteButton from '../../../components/buttons/delete/DeleteButton';
import Paginator from '../../../../../components/Paginator/Paginator';

function UsersTable({ currentUsers, currentPage, totalPages, onPageChange, onNew, onEdit, onDelete }) {
  return (
    <div className='admin-table-container'>
      <div className='admin-table-header'>
        <h2>Users</h2>
        <NewButton onClick={onNew} />
      </div>
      <div className='admin-table-wrapper'>
        <table className='admin-table'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Associated Referee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.roles ? user.roles.map(r => r.name).join(', ') : ''}</td>
              <td>
                {user.referee 
                  ? `${user.referee.dni?.name || ''} ${user.referee.dni?.surname || ''} (${user.referee.noLicense || 'N/A'})`
                  : '-'}
              </td>
              <td>
                <div className='admin-table-actions'>
                  <EditButton onClick={() => onEdit(user)} />
                  <DeleteButton onClick={() => onDelete(user.id)} />
                </div>
              </td>
            </tr>
          ))}
          {currentUsers.length === 0 && (
            <tr>
              <td colSpan="5" className='admin-no-data'>No users found.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default UsersTable;
