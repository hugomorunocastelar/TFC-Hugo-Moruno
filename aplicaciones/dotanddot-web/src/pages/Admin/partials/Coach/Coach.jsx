import React, { useEffect, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllCoaches } from '../../../../js/cruds/coaches.mjs';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import API from '../../../../js/env';

function Coach() {
  const [coaches, setCoaches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    noLicense: '',
    lvlLicense: '',
    teamId: '',
    personId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(coaches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCoaches = coaches.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch coaches
  const fetchCoaches = async () => {
    try {
      getAllCoaches()
      .then((response) => {
        if (response) setCoaches(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch teams for dropdown
  const fetchTeams = async () => {
    try {
      getAllTeams()
      .then((response) => {
        if (response) 
          setTeams(response);
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
    fetchCoaches();
    fetchTeams();
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      teamId: '',
      personId: '',
    });
    setSelectedCoach(null);
    setFormOpen(true);
  };

  const openFormForEdit = (coach) => {
    setFormData({
      id: coach.id,
      noLicense: coach.noLicense,
      lvlLicense: coach.lvlLicense,
      teamId: coach.team ? coach.team.id : '',
      personId: coach.dni ? coach.dni.id : '',
    });
    setSelectedCoach(coach);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedCoach(null);
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      teamId: '',
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
        team: formData.teamId ? { id: formData.teamId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };

      if (formData.id) {
        await put(API.COACH.UPDATE(formData.id), bodyData);
      } else {
        await post(API.COACH.CREATE, bodyData);
      }
      await fetchCoaches();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    try {
      await del(API.COACH.DELETE(id));
      await fetchCoaches();
      if (selectedCoach && selectedCoach.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container'>
      {!formOpen && (<div className='data-table'>
        <div className='table-header'>
          <h2>Coaches</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>No License</th>
              <th>Level License</th>
              <th>Team</th>
              <th>Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCoaches.map(coach => (
              <tr key={coach.id}>
                <td>{coach.noLicense}</td>
                <td>{coach.lvlLicense}</td>
                <td>{coach.team ? coach.team.name : ''}</td>
                <td>{coach.dni ? `${coach.dni.name} ${coach.dni.surnames || ''}` : ''}</td>
                <td>
                  <button onClick={() => openFormForEdit(coach)}><EditButton /></button>
                  <button onClick={() => handleDelete(coach.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {coaches.length === 0 && (
              <tr>
                <td colSpan="5">No coaches found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>)}

      {formOpen && (
        <div className='data-form'>
          <h2>{formData.id ? 'Edit Coach' : 'New Coach'}</h2>
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
              Team:
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
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
              <CancelButton onClick={closeForm}/>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Coach;