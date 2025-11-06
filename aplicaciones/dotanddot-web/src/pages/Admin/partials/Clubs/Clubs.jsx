import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import './Clubs.css';
import { getAllClubs } from '../../../../js/cruds/clubs.mjs';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import API from '../../../../js/env';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    idCity: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(clubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClubs = clubs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch clubs - replace URL with your API endpoint
  const fetchClubs = async () => {
    try {
      getAllClubs()
      .then((response) => {
        if (response) setClubs(response);
      })
    } catch (error) {
      console.error(error);
    }
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
    fetchClubs();
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      idCity: '',
    });
    setSelectedClub(null);
    setFormOpen(true);
  };

  const openFormForEdit = (club) => {
    setFormData({
      id: club.id,
      name: club.name,
      idCity: club.idCity?.id || '',
    });
    setSelectedClub(club);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedClub(null);
    setFormData({
      id: null,
      name: '',
      idCity: '',
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
        idCity: formData.idCity,
      };

      if (formData.id) {
        await put(API.CLUBS.UPDATE(formData.id), bodyData);
      } else {
        await post(API.CLUBS.CREATE, bodyData);
      }
      await fetchClubs();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await del(API.CLUBS.DELETE(id));
      await fetchClubs();
      if (selectedClub && selectedClub.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Clubs'>
      <div className='Clubs-Table'>
        <div className='Clubs-Table-Header'>
          <h2>Clubs</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClubs.map(club => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>{club.idCity?.name || ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(club)}><EditButton /></button>
                  <button onClick={() => handleDelete(club.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {clubs.length === 0 && (
              <tr>
                <td colSpan="3">No clubs found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
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
        <div className='Clubs-Form'>
          <h2>{formData.id ? 'Edit Club' : 'New Club'}</h2>
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
            <div className='Clubs-Form-Actions'>
              <button type="submit">{formData.id ? <UpdateButton /> : <CreateButton />}</button>
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Clubs;