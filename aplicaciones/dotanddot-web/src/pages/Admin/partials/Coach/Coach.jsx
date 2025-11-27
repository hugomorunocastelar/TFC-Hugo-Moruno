import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllCoaches } from '../../../../js/cruds/coaches.mjs';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import CoachTable from './partials/CoachTable.jsx';
import CoachForm from './partials/CoachForm.jsx';
import '../shared-styles.css';

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
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(coaches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCoaches = coaches.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchCoaches = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllCoaches()
        .then((response) => { setCoaches(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
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
      await fetchCoaches(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    try {
      await del(API.COACH.DELETE(id));
      await fetchCoaches(true);
      if (selectedCoach && selectedCoach.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <CoachForm
          formData={formData}
          teams={teams}
          persons={persons}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <CoachTable
          currentCoaches={currentCoaches}
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

export default Coach;