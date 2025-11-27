import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllSeasons } from '../../../../js/cruds/seasons.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import SeasonsTable from './partials/SeasonsTable.jsx';
import SeasonsForm from './partials/SeasonsForm.jsx';
import '../shared-styles.css';

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
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(seasons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSeasons = seasons.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchSeasons = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllSeasons()
        .then((response) => { setSeasons(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
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
      await fetchSeasons(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this season?')) return;
    try {
      await del(API.SEASONS.DELETE(id));
      await fetchSeasons(true);
      if (selectedSeason && selectedSeason.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <SeasonsForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <SeasonsTable
          currentSeasons={currentSeasons}
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

export default Seasons;
