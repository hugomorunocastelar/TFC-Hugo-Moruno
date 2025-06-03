import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import './Person.css';

function Person() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    dni: '',
    name: '',
    surnames: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    dniVerified: false,
    tutored: false,
    tutorId: '',
  });

  // Fetch persons - replace URL with your API endpoint
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

  // Fetch persons again to populate tutor dropdown (excluding self)
  const fetchTutors = async () => {
    try {
      const response = await fetch('/api/persons'); // Same endpoint for tutors
      if (!response.ok) throw new Error('Failed to fetch tutors');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      dni: '',
      name: '',
      surnames: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
      dniVerified: false,
      tutored: false,
      tutorId: '',
    });
    setSelectedPerson(null);
    setFormOpen(true);
  };

  const openFormForEdit = (person) => {
    setFormData({
      id: person.id,
      dni: person.dni,
      name: person.name,
      surnames: person.surnames,
      birthDate: person.birthDate ? person.birthDate.split('T')[0] : '',
      address: person.address || '',
      phone: person.phone || '',
      email: person.email || '',
      dniVerified: person.dniVerified,
      tutored: person.tutored,
      tutorId: person.tutor ? person.tutor.id : '',
    });
    setSelectedPerson(person);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedPerson(null);
    setFormData({
      id: null,
      dni: '',
      name: '',
      surnames: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
      dniVerified: false,
      tutored: false,
      tutorId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/persons/${formData.id}` : '/api/persons'; // Replace with your URLs
      const bodyData = {
        dni: formData.dni,
        name: formData.name,
        surnames: formData.surnames,
        birthDate: formData.birthDate,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        dniVerified: formData.dniVerified,
        tutored: formData.tutored,
        tutor: formData.tutorId ? { id: formData.tutorId } : null,
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) throw new Error('Failed to save person');
      await fetchPersons();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return;
    try {
      const response = await fetch(`/api/persons/${id}`, { method: 'DELETE' }); // Replace with your URL
      if (!response.ok) throw new Error('Failed to delete person');
      await fetchPersons();
      if (selectedPerson && selectedPerson.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    // Load tutors for dropdown
    fetchTutors().then(data => setTutors(data));
  }, []);

  return (
    <div className='Person'>
      <div className='Person-Table'>
        <div className='Person-Table-Header'>
          <h2>Persons</h2>
          <NewButton action={openFormForCreate} text="Person" />
        </div>
        <table>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Name</th>
              <th>Surnames</th>
              <th>Birth Date</th>
              <th>DNI Verified</th>
              <th>Tutored</th>
              <th>Tutor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(person => (
              <tr key={person.id}>
                <td>{person.dni}</td>
                <td>{person.name}</td>
                <td>{person.surnames}</td>
                <td>{person.birthDate ? person.birthDate.split('T')[0] : ''}</td>
                <td>{person.dniVerified ? 'Yes' : 'No'}</td>
                <td>{person.tutored ? 'Yes' : 'No'}</td>
                <td>{person.tutor ? person.tutor.name + ' ' + person.tutor.surnames : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(person)}>Edit</button>
                  <button onClick={() => handleDelete(person.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {persons.length === 0 && (
              <tr>
                <td colSpan="8">No persons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className='Person-Form'>
          <h2>{formData.id ? 'Edit Person' : 'New Person'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              DNI*:
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                required
                maxLength={12}
                disabled={!!formData.id}
              />
            </label>
            <label>
              Name*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={20}
              />
            </label>
            <label>
              Surnames*:
              <input
                type="text"
                name="surnames"
                value={formData.surnames}
                onChange={handleInputChange}
                required
                maxLength={60}
              />
            </label>
            <label>
              Birth Date*:
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                maxLength={100}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={25}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={70}
              />
            </label>
            <label>
              DNI Verified*:
              <input
                type="checkbox"
                name="dniVerified"
                checked={formData.dniVerified}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Tutored*:
              <input
                type="checkbox"
                name="tutored"
                checked={formData.tutored}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Tutor:
              <select
                name="tutorId"
                value={formData.tutorId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {tutors
                  .filter(t => !formData.id || t.id !== formData.id) // exclude self
                  .map(tutor => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name} {tutor.surnames}
                    </option>
                  ))}
              </select>
            </label>
            <div className='Person-Form-Actions'>
              <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Person;