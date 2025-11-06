import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import './City.css';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import API from '../../../../js/env';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(cities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCities = cities.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
      const bodyData = {
        name: formData.name,
        region: formData.region,
        firstPC: formData.firstPC,
        lastPC: formData.lastPC,
      };

      if (formData.id) {
        await put(API.CITIES.UPDATE(formData.id), bodyData);
      } else {
        await post(API.CITIES.CREATE, bodyData);
      }
      await fetchCities();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    try {
      await del(API.CITIES.DELETE(id));
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
          <button onClick={openFormForCreate}><NewButton /></button>
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
            {currentCities.map(city => (
              <tr key={city.id}>
                <td>{city.name}</td>
                <td>{city.region}</td>
                <td>{city.firstPC}</td>
                <td>{city.lastPC}</td>
                <td>
                  <button onClick={() => openFormForEdit(city)}><EditButton /></button>
                  <button onClick={() => handleDelete(city.id)}><DeleteButton /></button>
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
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
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
              <button type="submit">{formData.id ? <UpdateButton /> : <CreateButton />}</button>
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default City;