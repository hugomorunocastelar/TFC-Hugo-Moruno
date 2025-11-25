import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllUsers } from '../../../../js/cruds/users.mjs';
import { getAllRoles } from '../../../../js/cruds/roles.mjs';
import API from '../../../../js/env';

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    roles: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      getAllUsers()
      .then((response) => {
        if (response) setUsers(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      getAllRoles()
      .then((response) => {
        if (response) setRoles(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      username: '',
      email: '',
      password: '',
      roles: [],
    });
    setSelectedUser(null);
    setFormOpen(true);
  };

  const openFormForEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      password: '',
      roles: user.roles ? user.roles.map(role => role.id) : [],
    });
    setSelectedUser(user);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedUser(null);
    setFormData({
      id: null,
      username: '',
      email: '',
      password: '',
      roles: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        roles: formData.roles.map(roleId => ({ id: roleId })),
      };
      if (!bodyData.password) delete bodyData.password;

      if (formData.id) {
        await put(API.USERS.UPDATE(formData.id), bodyData);
      } else {
        await post(API.USERS.CREATE, bodyData);
      }
      await fetchUsers();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await del(API.USERS.DELETE(id));
      await fetchUsers();
      if (selectedUser && selectedUser.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className='container'>
      <div className='data-table'>
        <div className='table-header'>
          <h2>Users</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
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
                  <button onClick={() => openFormForEdit(user)}><EditButton /></button>
                  <button onClick={() => handleDelete(user.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

      {formOpen && (
        <div className='data-form'>
          <h2>{formData.id ? 'Edit User' : 'New User'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Username*:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                maxLength={50}
                disabled={!!formData.id}
              />
            </label>
            <label>
              Email*:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                maxLength={150}
              />
            </label>
            <label>
              Password{formData.id ? ' (leave blank to keep current)' : '*'}:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                {...(!formData.id && { required: true })}
                maxLength={120}
              />
            </label>
            <label>
              Roles*:
              <select
                name="roles"
                multiple
                value={formData.roles}
                onChange={handleInputChange}
                required
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <div className='data-form-buttons'>
              {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Users;