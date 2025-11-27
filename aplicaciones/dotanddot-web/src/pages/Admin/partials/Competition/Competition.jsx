import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllCompetitions } from '../../../../js/cruds/competition.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import CompetitionTable from './partials/CompetitionTable.jsx';
import CompetitionForm from './partials/CompetitionForm.jsx';
import '../shared-styles.css';

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
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(competitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompetitions = competitions.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchCompetitions = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllCompetitions()
        .then((response) => { setCompetitions(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
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
      await fetchCompetitions(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this competition?')) return;
    try {
      await del(API.COMPETITION.DELETE(id));
      await fetchCompetitions(true);
      if (selectedCompetition && selectedCompetition.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <CompetitionForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <CompetitionTable
          currentCompetitions={currentCompetitions}
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

export default Competition;
