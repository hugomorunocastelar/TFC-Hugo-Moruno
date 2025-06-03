import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './City.css';
import { getAllCities } from '../../../../js/cruds/cities.mjs';

function City() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    region: '',
    firstPC: '',
    lastPC: '',
  });

  const fetchCities = async () => {
    try {
      getAllCities()
      .then((response) => {
        if (response) setCities(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      region: '',
      firstPC: '',
      lastPC: '',
    });
    setSelectedCity(null);
    setFormOpen(true);
  };

  const openFormForEdit = (city) => {
    setFormData(city);
    setSelectedCity(city);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedCity(null);
    setFormData({
      id: null,
      name: '',
      region: '',
      firstPC: '',
      lastPC: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/cities/${formData.id}` : '/api/cities'; // Replace with your URLs
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save city');
      await fetchCities();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    try {
      const response = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete city');
      await fetchCities();
      if (selectedCity && selectedCity.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='City'>
      <div className='City-Table'>
        <div className='City-Table-Header'>
          <h2>Cities</h2>
          <NewButton action={openFormForCreate} text="City" />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>First PC</th>
              <th>Last PC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.id}>
                <td>{city.name}</td>
                <td>{city.region}</td>
                <td>{city.firstPC}</td>
                <td>{city.lastPC}</td>
                <td>
                  <button onClick={() => openFormForEdit(city)}>Edit</button>
                  <button onClick={() => handleDelete(city.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
              <tr>
                <td colSpan="5">No cities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='City-Form'>
          <h2>{formData.id ? 'Edit City' : 'New City'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
            </label>
            <label>
              Region:
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                maxLength={50}
              />
            </label>
            <label>
              First PC:
              <input
                type="text"
                name="firstPC"
                value={formData.firstPC}
                onChange={handleInputChange}
                required
                maxLength={10}
              />
            </label>
            <label>
              Last PC:
              <input
                type="text"
                name="lastPC"
                value={formData.lastPC}
                onChange={handleInputChange}
                maxLength={10}
              />
            </label>
            <div className='City-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default City;