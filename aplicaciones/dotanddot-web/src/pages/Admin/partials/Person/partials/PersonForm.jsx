import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function PersonForm({ formData, tutors, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit Person' : 'New Person'}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className='admin-form-section'>
          <div className='admin-form-grid'>
            <label>
              <span>DNI*</span>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={onChange}
                required
                maxLength={12}
                disabled={!!formData.id}
              />
            </label>
            <label>
              <span>Name*</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                maxLength={20}
              />
            </label>
            <label>
              <span>Surnames*</span>
              <input
                type="text"
                name="surnames"
                value={formData.surnames}
                onChange={onChange}
                required
                maxLength={60}
              />
            </label>
            <label>
              <span>Birth Date*</span>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <span>Address</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onChange}
                maxLength={100}
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                maxLength={25}
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                maxLength={70}
              />
            </label>
            <label>
              <span>DNI Verified*</span>
              <input
                type="checkbox"
                name="dniVerified"
                checked={formData.dniVerified}
                onChange={onChange}
              />
            </label>
            <label>
              <span>Tutored*</span>
              <input
                type="checkbox"
                name="tutored"
                checked={formData.tutored}
                onChange={onChange}
              />
            </label>
            <label>
              <span>Tutor</span>
              <select
                name="tutorId"
                value={formData.tutorId}
                onChange={onChange}
              >
                <option value="">None</option>
                {tutors && tutors
                  .filter(t => !formData.id || t.id !== formData.id)
                  .map(tutor => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name} {tutor.surnames}
                    </option>
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

export default PersonForm;
