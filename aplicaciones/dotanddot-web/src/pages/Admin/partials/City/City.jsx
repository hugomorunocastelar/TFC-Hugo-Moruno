import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import CityTable from './partials/CityTable.jsx';
import CityForm from './partials/CityForm.jsx';
import '../shared-styles.css';

function City() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    region: '',
    firstPC: '',
    lastPC: '',
    latitude: null,
    longitude: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(cities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCities = cities.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchCities = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllCities()
        .then((response) => {
          setCities(response || []);
          setLoadingData(false);
        })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      region: '',
      firstPC: '',
      lastPC: '',
      latitude: null,
      longitude: null,
    });
    setSelectedCity(null);
    setFormOpen(true);
  };

  const openFormForEdit = (city) => {
    setFormData({
      id: city.id,
      name: city.name,
      region: city.region,
      firstPC: city.firstPC,
      lastPC: city.lastPC,
      latitude: city.latitude || null,
      longitude: city.longitude || null,
    });
    setSelectedCity(city);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedCity(null);
    setFormData({
      id: null,
      name: '',
      region: '',
      firstPC: '',
      lastPC: '',
      latitude: null,
      longitude: null,
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
        region: formData.region,
        firstPC: formData.firstPC,
        lastPC: formData.lastPC,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      if (formData.id) {
        await put(API.CITIES.UPDATE(formData.id), bodyData);
      } else {
        await post(API.CITIES.CREATE, bodyData);
      }
      await fetchCities(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    try {
      await del(API.CITIES.DELETE(id));
      await fetchCities(true);
      if (selectedCity && selectedCity.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <CityForm formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} onCancel={closeForm} />
      ) : (
        <CityTable
          currentCities={currentCities}
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

export default City;