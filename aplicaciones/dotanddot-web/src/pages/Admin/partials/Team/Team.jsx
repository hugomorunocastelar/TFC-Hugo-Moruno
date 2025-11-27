import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import { getAllClubs } from '../../../../js/cruds/clubs.mjs';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import TeamTable from './partials/TeamTable.jsx';
import TeamForm from './partials/TeamForm.jsx';
import '../shared-styles.css';

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
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(teams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeams = teams.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchTeams = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllTeams()
        .then((response) => { setTeams(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
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
      await fetchTeams(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await del(API.TEAM.DELETE(id));
      await fetchTeams(true);
      if (selectedTeam && selectedTeam.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [ 'U10', 'U12', 'U14', 'U16', 'U18', 'Senior' ];

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <TeamForm
          formData={formData}
          persons={persons}
          clubs={clubs}
          categories={categories}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <TeamTable
          currentTeams={currentTeams}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNew={openFormForCreate}
          onEdit={openFormForEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Team;