import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllUsers } from '../../../../js/cruds/users.mjs';
import { getAllRoles } from '../../../../js/cruds/roles.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import UsersTable from './partials/UsersTable.jsx';
import UsersForm from './partials/UsersForm.jsx';
import '../shared-styles.css';

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
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const fetchUsers = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllUsers()
        .then((response) => { setUsers(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
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
      await fetchUsers(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await del(API.USERS.DELETE(id));
      await fetchUsers(true);
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
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : !formOpen ? (
          <UsersTable
            currentUsers={currentUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNew={openFormForCreate}
            onEdit={openFormForEdit}
            onDelete={handleDelete}
          />
      ) : (
            <UsersForm
              formData={formData}
              roles={roles}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          )
      }
    </div>
  );
}

export default Users;