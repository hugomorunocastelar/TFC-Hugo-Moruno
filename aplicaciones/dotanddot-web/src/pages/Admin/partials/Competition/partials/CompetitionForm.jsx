import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function CompetitionForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit Competition' : 'New Competition'}</h2>
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
              <span>Start Date*</span>
              <input
                type="date"
                name="dayStart"
                value={formData.dayStart}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <span>End Date*</span>
              <input
                type="date"
                name="dayEnd"
                value={formData.dayEnd}
                onChange={onChange}
                required
              />
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

export default CompetitionForm;
