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
import { getAllClubs } from '../../../../js/cruds/clubs.mjs';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import API from '../../../../js/env';

function Team() {
  const [teams, setTeams] = useState([]);
  const [persons, setPersons] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    dniCaptainId: '',
    idClubId: '',
    category: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(teams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeams = teams.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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

  useEffect(() => {
    fetchTeams();
    fetchPersons();
    fetchClubs();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      dniCaptainId: '',
      idClubId: '',
      category: '',
    });
    setSelectedTeam(null);
    setFormOpen(true);
  };

  const openFormForEdit = (team) => {
    setFormData({
      id: team.id,
      name: team.name,
      dniCaptainId: team.dniCaptain?.id || '',
      idClubId: team.idClub?.id || '',
      category: team.category || '',
    });
    setSelectedTeam(team);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedTeam(null);
    setFormData({
      id: null,
      name: '',
      dniCaptainId: '',
      idClubId: '',
      category: '',
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
        dniCaptain: { id: formData.dniCaptainId },
        idClub: { id: formData.idClubId },
        category: formData.category,
      };

      if (formData.id) {
        await put(API.TEAM.UPDATE(formData.id), bodyData);
      } else {
        await post(API.TEAM.CREATE, bodyData);
      }
      await fetchTeams();
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await del(API.TEAM.DELETE(id));
      await fetchTeams();
      if (selectedTeam && selectedTeam.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    'U10',
    'U12',
    'U14',
    'U16',
    'U18',
    'Senior',
  ];

  return (
    <div className='container'>
      <div className='data-table'>
        <div className='table-header'>
          <h2>Teams</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Captain</th>
              <th>Club</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeams.map(team => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.dniCaptain ? `${team.dniCaptain.name} ${team.dniCaptain.surnames || ''}` : ''}</td>
                <td>{team.idClub ? team.idClub.name : ''}</td>
                <td>{team.category}</td>
                <td>
                  <button onClick={() => openFormForEdit(team)}><EditButton /></button>
                  <button onClick={() => handleDelete(team.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan="5">No teams found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>

      {formOpen && (
        <div className='data-form'>
          <h2>{formData.id ? 'Edit Team' : 'New Team'}</h2>
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
              Captain*:
              <select
                name="dniCaptainId"
                value={formData.dniCaptainId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a captain</option>
                {persons.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} {person.surnames || ''}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Club*:
              <select
                name="idClubId"
                value={formData.idClubId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
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

export default Team;