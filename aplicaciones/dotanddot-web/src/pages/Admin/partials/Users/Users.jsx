import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Users.css';

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

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch roles for selection
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
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
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/users/${formData.id}` : '/api/users'; // Replace with your URLs
      const bodyData = {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined, // Only send password if set
        roles: formData.roles.map(roleId => ({ id: roleId })),
      };
      // Remove password if empty to avoid overwriting with empty string
      if (!bodyData.password) delete bodyData.password;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save user');
      await fetchUsers();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
      if (selectedUser && selectedUser.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Users'>
      <div className='Users-Table'>
        <div className='Users-Table-Header'>
          <h2>Users</h2>
          <NewButton action={openFormForCreate} text="User" />
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
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.roles ? user.roles.map(r => r.name).join(', ') : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
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

      {formOpen && (
        <div className='Users-Form'>
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
            <div className='Users-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Users;