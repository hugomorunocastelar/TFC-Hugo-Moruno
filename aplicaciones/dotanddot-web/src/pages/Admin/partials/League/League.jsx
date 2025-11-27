import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllLeagues } from '../../../../js/cruds/leagues.mjs';
import { getAllCompetitions } from '../../../../js/cruds/competition.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import LeagueTable from './partials/LeagueTable.jsx';
import LeagueForm from './partials/LeagueForm.jsx';
import '../shared-styles.css';

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
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(leagues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeagues = leagues.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchLeagues = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllLeagues()
        .then((response) => { setLeagues(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
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
      await fetchLeagues(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this league?')) return;
    try {
      await del(API.LEAGUE.DELETE(id));
      await fetchLeagues(true);
      if (selectedLeague && selectedLeague.id === id) closeForm();
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
        <LeagueForm
          formData={formData}
          competitions={competitions}
          categories={categories}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <LeagueTable
          currentLeagues={currentLeagues}
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

export default League;