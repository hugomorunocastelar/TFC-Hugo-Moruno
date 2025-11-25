import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import { getAllReferees } from '../../../../js/cruds/referees.mjs';
import API from '../../../../js/env';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(referees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReferees = referees.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch referees
  const fetchReferees = async () => {
    try {
      getAllReferees()
      .then((response) => {
        if (response) setReferees(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch cities for dropdown
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

  // Fetch persons for dropdown
  const fetchPersons = async () => {
    try {
      getAllPersons()
      .then((response) => {
        if (response) 
          setPersons(response);
      })
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
      const bodyData = {
        noLicense: formData.noLicense,
        lvlLicense: formData.lvlLicense,
        city: formData.cityId ? { id: formData.cityId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };

      if (formData.id) {
        await put(API.REFEREE.UPDATE(formData.id), bodyData);
      } else {
        await post(API.REFEREE.CREATE, bodyData);
      }
      await fetchReferees();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this referee?')) return;
    try {
      await del(API.REFEREE.DELETE(id));
      await fetchReferees();
      if (selectedReferee && selectedReferee.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container'>
      {!formOpen && (
        <div className='data-table'>
          <div className='table-header'>
            <h2>Referees</h2>
            <button onClick={openFormForCreate}><NewButton /></button>
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
              {currentReferees.map(referee => (
                <tr key={referee.id}>
                  <td>{referee.noLicense}</td>
                  <td>{referee.lvlLicense}</td>
                  <td>{referee.city ? referee.city.name : ''}</td>
                  <td>{referee.dni ? `${referee.dni.name} ${referee.dni.surnames || ''}` : ''}</td>
                  <td>
                    <button onClick={() => openFormForEdit(referee)}><EditButton /></button>
                    <button onClick={() => handleDelete(referee.id)}><DeleteButton /></button>
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
          <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      )}

      {formOpen && (
        <div className='data-form'>
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
            <div className='data-form-buttons'>
              {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Referee;