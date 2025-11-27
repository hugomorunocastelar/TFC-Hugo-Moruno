import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function TeamForm({ formData, persons, clubs, categories, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit Team' : 'New Team'}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className='admin-form-section'>
          <div className='admin-form-grid'>
            <label>
              <span>Name*</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                maxLength={50}
              />
            </label>
            <label>
              <span>Captain*</span>
              <select name="dniCaptainId" value={formData.dniCaptainId} onChange={onChange} required>
                <option value="">Select a captain</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} {person.surnames || ''}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Club*</span>
              <select name="idClubId" value={formData.idClubId} onChange={onChange} required>
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Category*</span>
              <select name="category" value={formData.category} onChange={onChange} required>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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

export default TeamForm;
