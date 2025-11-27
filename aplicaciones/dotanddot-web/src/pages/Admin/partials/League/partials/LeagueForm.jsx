import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function LeagueForm({ formData, competitions, categories, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit League' : 'New League'}</h2>
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
              <span>Category*</span>
              <select name="category" value={formData.category} onChange={onChange} required>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Competition*</span>
              <select name="competitionId" value={formData.competitionId} onChange={onChange} required>
                <option value="">Select a competition</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Code Prefix*</span>
              <input
                type="text"
                name="codePrefix"
                value={formData.codePrefix}
                onChange={onChange}
                required
                maxLength={20}
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

export default LeagueForm;
