import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import { getAllGameplaces } from '../../../../js/cruds/gameplaces.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import GameplaceTable from './partials/GameplaceTable.jsx';
import GameplaceForm from './partials/GameplaceForm.jsx';
import '../shared-styles.css';

function Gameplace() {
  const [gameplaces, setGameplaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedGameplace, setSelectedGameplace] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    gamefields: 1,
    address: '',
    idCity: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(gameplaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGameplaces = gameplaces.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchGameplaces = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllGameplaces()
        .then((response) => { setGameplaces(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
  };

  const fetchCities = async () => {
    try {
      getAllCities()
      .then((response) => {
        if (response) setCities(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGameplaces();
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      gamefields: 1,
      address: '',
      idCity: '',
    });
    setSelectedGameplace(null);
    setFormOpen(true);
  };

  const openFormForEdit = (gameplace) => {
    setFormData({
      id: gameplace.id,
      name: gameplace.name,
      gamefields: gameplace.gamefields || 1,
      address: gameplace.address,
      idCity: gameplace.idCity ? gameplace.idCity.id : '',
    });
    setSelectedGameplace(gameplace);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedGameplace(null);
    setFormData({
      id: null,
      name: '',
      gamefields: 1,
      address: '',
      idCity: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        name: formData.name,
        gamefields: formData.gamefields,
        address: formData.address,
        idCity: formData.idCity ? { id: formData.idCity } : null,
      };

      if (formData.id) {
        await put(API.GAMEPLACE.UPDATE(formData.id), bodyData);
      } else {
        await post(API.GAMEPLACE.CREATE, bodyData);
      }
      await fetchGameplaces(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gameplace?')) return;
    try {
      await del(API.GAMEPLACE.DELETE(id));
      await fetchGameplaces(true);
      if (selectedGameplace && selectedGameplace.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <GameplaceForm
          formData={formData}
          cities={cities}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <GameplaceTable
          currentGameplaces={currentGameplaces}
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

export default Gameplace;