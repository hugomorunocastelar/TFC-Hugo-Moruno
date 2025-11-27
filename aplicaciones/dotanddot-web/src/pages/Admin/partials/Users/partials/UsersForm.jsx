import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function UsersForm({ formData, roles, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit User' : 'New User'}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className='admin-form-section'>
          <div className='admin-form-grid'>
            <label>
              <span>Username*</span>
              <input type="text" name="username" value={formData.username} onChange={onChange} required maxLength={50} disabled={!!formData.id} />
            </label>
            <label>
              <span>Email*</span>
              <input type="email" name="email" value={formData.email} onChange={onChange} required maxLength={150} />
            </label>
            <label>
              <span>Password{formData.id ? ' (leave blank to keep current)' : '*'}</span>
              <input type="password" name="password" value={formData.password} onChange={onChange} {...(!formData.id && { required: true })} maxLength={120} />
            </label>
            <label>
              <span>Roles*</span>
              <select name="roles" multiple value={formData.roles} onChange={onChange} required>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className='admin-form-buttons'>
          {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </div>
  );
}

export default UsersForm;
