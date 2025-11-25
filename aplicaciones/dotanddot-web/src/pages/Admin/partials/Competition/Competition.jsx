import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllCompetitions } from '../../../../js/cruds/competition.mjs';
import API from '../../../../js/env';

function Competition() {
  const [competitions, setCompetitions] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    dayStart: '',
    dayEnd: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(competitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompetitions = competitions.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchCompetitions = async () => {
    try {
      getAllCompetitions()
      .then((response) => {
        if (response) setCompetitions(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const openFormForCreate = () => {
    setFormData({
      id: null,
      name: '',
      dayStart: '',
      dayEnd: '',
    });
    setSelectedCompetition(null);
    setFormOpen(true);
  };

  const openFormForEdit = (competition) => {
    setFormData({
      id: competition.id,
      name: competition.name,
      dayStart: competition.dayStart ? competition.dayStart.split('T')[0] : '',
      dayEnd: competition.dayEnd ? competition.dayEnd.split('T')[0] : '',
    });
    setSelectedCompetition(competition);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedCompetition(null);
    setFormData({
      id: null,
      name: '',
      dayStart: '',
      dayEnd: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        name: formData.name,
        dayStart: formData.dayStart,
        dayEnd: formData.dayEnd,
      };

      if (formData.id) {
        await put(API.COMPETITION.UPDATE(formData.id), bodyData);
      } else {
        await post(API.COMPETITION.CREATE, bodyData);
      }
      await fetchCompetitions();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this competition?')) return;
    try {
      await del(API.COMPETITION.DELETE(id));
      await fetchCompetitions();
      if (selectedCompetition && selectedCompetition.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container'>
      {!formOpen && (<div className='data-table'>
        <div className='table-header'>
          <h2>Competitions</h2>
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
            {currentCompetitions.map(comp => (
              <tr key={comp.id}>
                <td>{comp.name}</td>
                <td>{comp.dayStart ? comp.dayStart.split('T')[0] : ''}</td>
                <td>{comp.dayEnd ? comp.dayEnd.split('T')[0] : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(comp)}><EditButton /></button>
                  <button onClick={() => handleDelete(comp.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {competitions.length === 0 && (
              <tr>
                <td colSpan="4">No competitions found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>)}

      {formOpen && (
        <div className='data-form'>
          <h2>{formData.id ? 'Edit Competition' : 'New Competition'}</h2>
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
              Start Date*:
              <input
                type="date"
                name="dayStart"
                value={formData.dayStart}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              End Date*:
              <input
                type="date"
                name="dayEnd"
                value={formData.dayEnd}
                onChange={handleInputChange}
                required
              />
            </label>
            <div className='data-form-buttons'>
              {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
              <CancelButton onClick={closeForm}/>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Competition;
