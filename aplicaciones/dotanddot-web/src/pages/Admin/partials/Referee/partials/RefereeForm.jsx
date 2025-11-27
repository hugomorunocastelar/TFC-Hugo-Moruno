import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';

function RefereeForm({ formData, cities, persons, onChange, onSubmit, onCancel }) {
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit Referee' : 'New Referee'}</h2>
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
              <span>City</span>
              <select name="cityId" value={formData.cityId} onChange={onChange}>
                <option value="">None</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
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

export default RefereeForm;
