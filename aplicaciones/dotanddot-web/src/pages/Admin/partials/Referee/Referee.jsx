import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import { getAllCities } from '../../../../js/cruds/cities.mjs';
import { getAllReferees } from '../../../../js/cruds/referees.mjs';
import API from '../../../../js/env';
import Loader from '../../../Loader/Loader.jsx';
import RefereeTable from './partials/RefereeTable.jsx';
import RefereeForm from './partials/RefereeForm.jsx';
import '../shared-styles.css';

function Referee() {
  const [referees, setReferees] = useState([]);
  const [cities, setCities] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    noLicense: '',
    lvlLicense: '',
    cityId: '',
    personId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(referees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReferees = referees.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fetch referees
  const fetchReferees = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllReferees()
        .then((response) => { setReferees(response || []); setLoadingData(false); })
        .catch((e) => { console.error(e); setLoadingData(false); });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
  };

  // Fetch cities for dropdown
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
    fetchReferees();
    fetchCities();
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      cityId: '',
      personId: '',
    });
    setSelectedReferee(null);
    setFormOpen(true);
  };

  const openFormForEdit = (referee) => {
    setFormData({
      id: referee.id,
      noLicense: referee.noLicense,
      lvlLicense: referee.lvlLicense,
      cityId: referee.city ? referee.city.id : '',
      personId: referee.dni ? referee.dni.id : '',
    });
    setSelectedReferee(referee);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedReferee(null);
    setFormData({
      id: null,
      noLicense: '',
      lvlLicense: '',
      cityId: '',
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
        city: formData.cityId ? { id: formData.cityId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };

      if (formData.id) {
        await put(API.REFEREE.UPDATE(formData.id), bodyData);
      } else {
        await post(API.REFEREE.CREATE, bodyData);
      }
      await fetchReferees(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this referee?')) return;
    try {
      await del(API.REFEREE.DELETE(id));
      await fetchReferees(true);
      if (selectedReferee && selectedReferee.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <RefereeForm
          formData={formData}
          cities={cities}
          persons={persons}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <RefereeTable
          currentReferees={currentReferees}
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

export default Referee;