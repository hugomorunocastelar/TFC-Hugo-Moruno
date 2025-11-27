import React from 'react';
import CreateButton from '../../../components/buttons/create/CreateButton';
import UpdateButton from '../../../components/buttons/update/UpdateButton';
import CancelButton from '../../../components/buttons/cancel/CancelButton';
import CoordinatesPicker from './CoordinatesPicker';

function CityForm({ formData, onChange, onSubmit, onCancel }) {
  const handleCoordinatesChange = ({ latitude, longitude }) => {
    onChange({ target: { name: 'latitude', value: latitude } });
    onChange({ target: { name: 'longitude', value: longitude } });
  };
  return (
    <div className='admin-form-container'>
      <div className='admin-form-header'>
        <h2>{formData.id ? 'Edit City' : 'New City'}</h2>
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
              <span>Region</span>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={onChange}
                maxLength={50}
              />
            </label>
            <label>
              <span>First PC</span>
              <input
                type="text"
                name="firstPC"
                value={formData.firstPC}
                onChange={onChange}
                required
                maxLength={10}
              />
            </label>
            <label>
              <span>Last PC</span>
              <input
                type="text"
                name="lastPC"
                value={formData.lastPC}
                onChange={onChange}
                maxLength={10}
              />
            </label>
            <CoordinatesPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onCoordinatesChange={handleCoordinatesChange}
              cityName={formData.name}
            />
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

export default CityForm;
