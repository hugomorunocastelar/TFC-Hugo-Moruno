import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllRoles } from '../../../../js/cruds/roles.mjs';
import API from '../../../../js/env';
import '../shared-styles.css';

function Roles() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRoles = roles.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
    fetchRoles();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
    });
    setSelectedRole(null);
    setFormOpen(true);
  };

  const openFormForEdit = (role) => {
    setFormData({
      id: role.id,
      name: role.name,
    });
    setSelectedRole(role);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedRole(null);
    setFormData({
      id: null,
      name: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = { name: formData.name };

      if (formData.id) {
        await put(API.ROLES.UPDATE(formData.id), bodyData);
      } else {
        await post(API.ROLES.CREATE, bodyData);
      }
      await fetchRoles();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await del(API.ROLES.DELETE(id));
      await fetchRoles();
      if (selectedRole && selectedRole.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {!formOpen && (
        <div className='admin-table-container'>
          <div className='admin-table-header'>
            <h2>Roles</h2>
            <NewButton onClick={openFormForCreate} />
          </div>
          <div className='admin-table-wrapper'>
            <table className='admin-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map(role => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>
                    <div className='admin-table-actions'>
                      <EditButton onClick={() => openFormForEdit(role)} />
                      <DeleteButton onClick={() => handleDelete(role.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan="2" className='admin-no-data'>No roles found.</td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
          <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      )}

      {formOpen && (
        <div className='admin-form-container'>
          <div className='admin-form-header'>
            <h2>{formData.id ? 'Edit Role' : 'New Role'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='admin-form-section'>
              <div className='admin-form-grid'>
                <label>
                  <span>Name*</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength={20}
                    disabled={!!formData.id}
                  />
                </label>
              </div>
            </div>
            <div className='admin-form-buttons'>
              {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
              <CancelButton onClick={closeForm}/>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Roles;
