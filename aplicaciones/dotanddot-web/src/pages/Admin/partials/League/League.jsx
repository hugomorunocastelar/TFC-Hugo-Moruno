import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import './League.css';
import { getAllLeagues } from '../../../../js/cruds/leagues.mjs';
import { getAllCompetitions } from '../../../../js/cruds/competition.mjs';
import API from '../../../../js/env';

function League() {
  const [leagues, setLeagues] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    competitionId: '',
    codePrefix: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(leagues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeagues = leagues.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchLeagues = async () => {
    try {
      getAllLeagues()
      .then((response) => {
        if (response) setLeagues(response);
      })
    } catch (error) {
      console.error(error);
    }
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
    fetchLeagues();
    fetchCompetitions();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      category: '',
      competitionId: '',
      codePrefix: '',
    });
    setSelectedLeague(null);
    setFormOpen(true);
  };

  const openFormForEdit = (league) => {
    setFormData({
      id: league.id,
      name: league.name,
      category: league.category || '',
      competitionId: league.competition ? league.competition.id : '',
      codePrefix: league.codePrefix,
    });
    setSelectedLeague(league);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedLeague(null);
    setFormData({
      id: null,
      name: '',
      category: '',
      competitionId: '',
      codePrefix: '',
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
        category: formData.category,
        competition: formData.competitionId ? { id: formData.competitionId } : null,
        codePrefix: formData.codePrefix,
      };

      if (formData.id) {
        await put(API.LEAGUE.UPDATE(formData.id), bodyData);
      } else {
        await post(API.LEAGUE.CREATE, bodyData);
      }
      await fetchLeagues();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this league?')) return;
    try {
      await del(API.LEAGUE.DELETE(id));
      await fetchLeagues();
      if (selectedLeague && selectedLeague.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Example categories - replace with your actual categories or fetch dynamically
  const categories = [
    'U10',
    'U12',
    'U14',
    'U16',
    'U18',
    'Senior',
  ];

  return (
    <div className='League'>
      <div className='League-Table'>
        <div className='League-Table-Header'>
          <h2>Leagues</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Competition</th>
              <th>Code Prefix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeagues.map(league => (
              <tr key={league.id}>
                <td>{league.name}</td>
                <td>{league.category}</td>
                <td>{league.competition ? league.competition.name : ''}</td>
                <td>{league.codePrefix}</td>
                <td>
                  <button onClick={() => openFormForEdit(league)}><EditButton /></button>
                  <button onClick={() => handleDelete(league.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {leagues.length === 0 && (
              <tr>
                <td colSpan="5">No leagues found.</td>
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
        <div className='League-Form'>
          <h2>{formData.id ? 'Edit League' : 'New League'}</h2>
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
              Category*:
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              Competition*:
              <select
                name="competitionId"
                value={formData.competitionId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a competition</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Code Prefix*:
              <input
                type="text"
                name="codePrefix"
                value={formData.codePrefix}
                onChange={handleInputChange}
                required
                maxLength={20}
              />
            </label>
            <div className='League-Form-Actions'>
              <button type="submit">{formData.id ? <UpdateButton /> : <CreateButton />}</button>
              <button type="button" onClick={closeForm}><CancelButton /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default League;