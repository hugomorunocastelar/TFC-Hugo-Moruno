import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllClubs } from '../../../../js/cruds/clubs.mjs';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import ClubsTable from './partials/ClubsTable.jsx';
import ClubsForm from './partials/ClubsForm.jsx';
import '../shared-styles.css';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    idCity: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(clubs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClubs = clubs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchClubs = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllClubs()
        .then((response) => { setClubs(response || []); setLoadingData(false); })
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
    fetchClubs();
    fetchCities();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      name: '',
      idCity: '',
    });
    setSelectedClub(null);
    setFormOpen(true);
  };

  const openFormForEdit = (club) => {
    setFormData({
      id: club.id,
      name: club.name,
      idCity: club.idCity?.id || '',
    });
    setSelectedClub(club);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedClub(null);
    setFormData({
      id: null,
      name: '',
      idCity: '',
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
        idCity: formData.idCity,
      };

      if (formData.id) {
        await put(API.CLUBS.UPDATE(formData.id), bodyData);
      } else {
        await post(API.CLUBS.CREATE, bodyData);
      }
      await fetchClubs(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await del(API.CLUBS.DELETE(id));
      await fetchClubs(true);
      if (selectedClub && selectedClub.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <ClubsForm formData={formData} cities={cities} onChange={handleInputChange} onSubmit={handleSubmit} onCancel={closeForm} />
      ) : (
        <ClubsTable
          currentClubs={currentClubs}
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

export default Clubs;