import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function CoachForm({ formData, teams, persons, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit Coach' : 'New Coach'}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className='admin-form-section'>
          <div className='admin-form-grid'>
            <label>
              <span>No License*</span>
              <input
                type="text"
                name="noLicense"
                value={formData.noLicense}
                onChange={onChange}
                required
                maxLength={20}
              />
            </label>
            <label>
              <span>Level License*</span>
              <input
                type="text"
                name="lvlLicense"
                value={formData.lvlLicense}
                onChange={onChange}
                required
                maxLength={3}
              />
            </label>
            <label>
              <span>Team</span>
              <select name="teamId" value={formData.teamId} onChange={onChange}>
                <option value="">None</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Person</span>
              <select name="personId" value={formData.personId} onChange={onChange}>
                <option value="">None</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} {person.surnames || ''}
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

export default CoachForm;
