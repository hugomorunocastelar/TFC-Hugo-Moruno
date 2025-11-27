import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function PlayerForm({ formData, teams, persons, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit Player' : 'New Player'}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className='admin-form-section'>
          <div className='admin-form-grid'>
            <label>
              <span>No Shirt*</span>
              <input
                type="number"
                name="noShirt"
                value={formData.noShirt}
                onChange={onChange}
                required
                min={0}
              />
            </label>
            <label>
              <span>Team</span>
              <select name="teamId" value={formData.teamId} onChange={onChange}>
                <option value="">None</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
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

export default PlayerForm;
