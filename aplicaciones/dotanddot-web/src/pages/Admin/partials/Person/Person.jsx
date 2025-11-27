import React, { useEffect, useState, useRef } from 'react';
import API from '../../../../js/env';
import { post, put, del } from '../../../../js/http';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import Loader from '../../../Loader/Loader.jsx';
import PersonTable from './partials/PersonTable.jsx';
import PersonForm from './partials/PersonForm.jsx';
import '../shared-styles.css';

function Person() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    dni: '',
    name: '',
    surnames: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    dniVerified: false,
    tutored: false,
    tutorId: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const fetchPersons = async (force = false) => {
    try {
      if (fetchedRef.current && !force) {
        return;
      }
      fetchedRef.current = true;
      setLoadingData(true);

      getAllPersons()
        .then((response) => {
          if (response) {
            setPersons(response);
            setTutors(response);
          } else {
            setPersons([]);
            setTutors([]);
          }
          setLoadingData(false);
        })
        .catch((e) => {
          console.error(e);
          setLoadingData(false);
        });
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      dni: '',
      name: '',
      surnames: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
      dniVerified: false,
      tutored: false,
      tutorId: '',
    });
    setSelectedPerson(null);
    setFormOpen(true);
  }

  const openFormForEdit = (person) => {
    setFormData({
      id: person.id,
      dni: person.dni,
      name: person.name,
      surnames: person.surnames,
      birthDate: person.birthDate ? person.birthDate.split('T')[0] : '',
      address: person.address || '',
      phone: person.phone || '',
      email: person.email || '',
      dniVerified: person.dniVerified,
      tutored: person.tutored,
      tutorId: person.tutor ? person.tutor.id : '',
    });
    setSelectedPerson(person);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedPerson(null);
    setFormData({
      id: null,
      dni: '',
      name: '',
      surnames: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
      dniVerified: false,
      tutored: false,
      tutorId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        dni: formData.dni,
        name: formData.name,
        surnames: formData.surnames,
        birthDate: formData.birthDate,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        dniVerified: formData.dniVerified,
        tutored: formData.tutored,
        tutor: formData.tutorId ? { id: formData.tutorId } : null,
      };

      if (formData.id) {
        await put(API.PERSON.UPDATE(formData.id), bodyData);
      } else {
        await post(API.PERSON.CREATE, bodyData);
      }
      await fetchPersons(true);
      closeForm();
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return;
    try {
      await del(API.PERSON.DELETE(id));
      await fetchPersons(true);
      if (selectedPerson && selectedPerson.id === id) closeForm();
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const [tutors, setTutors] = useState([]);

  const totalPages = Math.ceil(persons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPersons = persons.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : !formOpen ? (
        <PersonTable
          currentPersons={currentPersons}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNew={openFormForCreate}
          onEdit={openFormForEdit}
          onDelete={handleDelete}
        />
      ) : (
        <PersonForm
          formData={formData}
          tutors={tutors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

export default Person;