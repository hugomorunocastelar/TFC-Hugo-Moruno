import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Referee.css';

function Referee() {
  const [referees, setReferees] = useState([]);
  const [cities, setCities] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    noLicense: '',
    lvlLicense: '',
    cityId: '',
    personId: '',
  });

  // Fetch referees
  const fetchReferees = async () => {
    try {
      const response = await fetch('/api/referees'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch referees');
      const data = await response.json();
      setReferees(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch cities for dropdown
  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch persons for dropdown
  const fetchPersons = async () => {
    try {
      const response = await fetch('/api/persons'); // Replace with your URL
      if (!response.ok) throw new Error('Failed to fetch persons');
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReferees();
    fetchCities();
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      cityId: '',
      personId: '',
    });
    setSelectedReferee(null);
    setFormOpen(true);
  };

  const openFormForEdit = (referee) => {
    setFormData({
      id: referee.id,
      noLicense: referee.noLicense,
      lvlLicense: referee.lvlLicense,
      cityId: referee.city ? referee.city.id : '',
      personId: referee.dni ? referee.dni.id : '',
    });
    setSelectedReferee(referee);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedReferee(null);
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      cityId: '',
      personId: '',
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
      const url = formData.id ? `/api/referees/${formData.id}` : '/api/referees'; // Replace with your URLs
      const bodyData = {
        noLicense: formData.noLicense,
        lvlLicense: formData.lvlLicense,
        city: formData.cityId ? { id: formData.cityId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save referee');
      await fetchReferees();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this referee?')) return;
    try {
      const response = await fetch(`/api/referees/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete referee');
      await fetchReferees();
      if (selectedReferee && selectedReferee.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Referee'>
      <div className='Referee-Table'>
        <div className='Referee-Table-Header'>
          <h2>Referees</h2>
          <NewButton action={openFormForCreate} text="Referee" />
        </div>
        <table>
          <thead>
            <tr>
              <th>No License</th>
              <th>Level License</th>
              <th>City</th>
              <th>Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {referees.map(referee => (
              <tr key={referee.id}>
                <td>{referee.noLicense}</td>
                <td>{referee.lvlLicense}</td>
                <td>{referee.city ? referee.city.name : ''}</td>
                <td>{referee.dni ? `${referee.dni.name} ${referee.dni.surnames || ''}` : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(referee)}>Edit</button>
                  <button onClick={() => handleDelete(referee.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {referees.length === 0 && (
              <tr>
                <td colSpan="5">No referees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Referee-Form'>
          <h2>{formData.id ? 'Edit Referee' : 'New Referee'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              No License*:
              <input
                type="text"
                name="noLicense"
                value={formData.noLicense}
                onChange={handleInputChange}
                required
                maxLength={20}
              />
            </label>
            <label>
              Level License*:
              <input
                type="text"
                name="lvlLicense"
                value={formData.lvlLicense}
                onChange={handleInputChange}
                required
                maxLength={3}
              />
            </label>
            <label>
              City:
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Person:
              <select
                name="personId"
                value={formData.personId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} {person.surnames || ''}
                  </option>
                ))}
              </select>
            </label>
            <div className='Referee-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Referee;