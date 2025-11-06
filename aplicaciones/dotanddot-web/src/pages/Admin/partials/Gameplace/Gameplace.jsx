import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import './Gameplace.css';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import { getAllGameplaces } from '../../../../js/cruds/gameplaces.mjs';
import API from '../../../../js/env';

function Gameplace() {
  const [gameplaces, setGameplaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedGameplace, setSelectedGameplace] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    gamefields: 1,
    address: '',
    idCity: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(gameplaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGameplaces = gameplaces.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch gameplaces
  const fetchGameplaces = async () => {
    try {
      getAllGameplaces()
      .then((response) => {
        if (response) setGameplaces(response);
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

  useEffect(() => {
    fetchGameplaces();
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      gamefields: 1,
      address: '',
      idCity: '',
    });
    setSelectedGameplace(null);
    setFormOpen(true);
  };

  const openFormForEdit = (gameplace) => {
    setFormData({
      id: gameplace.id,
      name: gameplace.name,
      gamefields: gameplace.gamefields || 1,
      address: gameplace.address,
      idCity: gameplace.idCity ? gameplace.idCity.id : '',
    });
    setSelectedGameplace(gameplace);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedGameplace(null);
    setFormData({
      id: null,
      name: '',
      gamefields: 1,
      address: '',
      idCity: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        name: formData.name,
        gamefields: formData.gamefields,
        address: formData.address,
        idCity: formData.idCity ? { id: formData.idCity } : null,
      };

      if (formData.id) {
        await put(API.GAMEPLACE.UPDATE(formData.id), bodyData);
      } else {
        await post(API.GAMEPLACE.CREATE, bodyData);
      }
      await fetchGameplaces();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gameplace?')) return;
    try {
      await del(API.GAMEPLACE.DELETE(id));
      await fetchGameplaces();
      if (selectedGameplace && selectedGameplace.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Gameplace'>
      <div className='Gameplace-Table'>
        <div className='Gameplace-Table-Header'>
          <h2>Gameplaces</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gamefields</th>
              <th>Address</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentGameplaces.map(gp => (
              <tr key={gp.id}>
                <td>{gp.name}</td>
                <td>{gp.gamefields}</td>
                <td>{gp.address}</td>
                <td>{gp.idCity ? gp.idCity.name : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(gp)}><EditButton /></button>
                  <button onClick={() => handleDelete(gp.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {gameplaces.length === 0 && (
              <tr>
                <td colSpan="5">No gameplaces found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {gameplaces.length > 0 && (
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
        )}
      </div>

      {formOpen && (
        <div className='Gameplace-Form'>
          <h2>{formData.id ? 'Edit Gameplace' : 'New Gameplace'}</h2>
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
              Gamefields*:
              <input
                type="number"
                name="gamefields"
                value={formData.gamefields}
                onChange={handleInputChange}
                min={1}
                required
              />
            </label>
            <label>
              Address*:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </label>
            <label>
              City*:
              <select
                name="idCity"
                value={formData.idCity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <div className='Gameplace-Form-Actions'>
              <button type="submit">{formData.id ? <UpdateButton /> : <CreateButton />}</button>
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Gameplace;