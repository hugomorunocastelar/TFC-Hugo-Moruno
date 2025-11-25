import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllSeasons } from '../../../../js/cruds/seasons.mjs';
import API from '../../../../js/env';

function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(seasons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSeasons = seasons.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch seasons
  const fetchSeasons = async () => {
    try {
      getAllSeasons()
      .then((response) => {
        if (response) setSeasons(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      startDate: '',
      endDate: '',
    });
    setSelectedSeason(null);
    setFormOpen(true);
  };

  const openFormForEdit = (season) => {
    setFormData({
      id: season.id,
      name: season.name,
      startDate: season.startDate ? season.startDate.substring(0,10) : '',
      endDate: season.endDate ? season.endDate.substring(0,10) : '',
    });
    setSelectedSeason(season);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedSeason(null);
    setFormData({
      id: null,
      name: '',
      startDate: '',
      endDate: '',
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
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      if (formData.id) {
        await put(API.SEASONS.UPDATE(formData.id), bodyData);
      } else {
        await post(API.SEASONS.CREATE, bodyData);
      }
      await fetchSeasons();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this season?')) return;
    try {
      await del(API.SEASONS.DELETE(id));
      await fetchSeasons();
      if (selectedSeason && selectedSeason.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container'>
      <div className='data-table'>
        <div className='table-header'>
          <h2>Seasons</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSeasons.map(season => (
              <tr key={season.id}>
                <td>{season.name}</td>
                <td>{season.startDate ? season.startDate.substring(0,10) : ''}</td>
                <td>{season.endDate ? season.endDate.substring(0,10) : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(season)}><EditButton /></button>
                  <button onClick={() => handleDelete(season.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {seasons.length === 0 && (
              <tr>
                <td colSpan="4">No seasons found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>

      {formOpen && (
        <div className='data-form'>
          <h2>{formData.id ? 'Edit Season' : 'New Season'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </label>
            <label>
              Start Date*:
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              End Date*:
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
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

export default Seasons;
