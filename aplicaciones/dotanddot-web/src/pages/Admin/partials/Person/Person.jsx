import React, { useEffect, useState } from 'react';
import NewButton from '../../components/buttons/new/NewButton';
import EditButton from '../../components/buttons/edit/EditButton';
import DeleteButton from '../../components/buttons/delete/DeleteButton';
import CreateButton from '../../components/buttons/create/CreateButton';
import UpdateButton from '../../components/buttons/update/UpdateButton';
import CancelButton from '../../components/buttons/cancel/CancelButton';
import API from '../../../../js/env';
import { post, put, del } from '../../../../js/http';
import Paginator from '../../../../components/Paginator/Paginator';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';

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

  const fetchTutors = async () => {
    try {
      getAllPersons()
      .then((response) => {
        if (response)
          setTutors(response);
      })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  useEffect(() => {
    fetchTutors()
    .then(
      data => setTutors(data)
    );
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
  };

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
      await fetchPersons();
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
      await fetchPersons();
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
    <div className='container'>
      {!formOpen && (<div className='data-table'>
        <div className='table-header'>
          <h2>Persons</h2>
          <button onClick={openFormForCreate}><NewButton /></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Name</th>
              <th>Surnames</th>
              <th>DNI Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPersons.map(person => (
              <tr key={person.id}>
                <td>{person.dni}</td>
                <td>{person.name}</td>
                <td>{person.surnames}</td>
                <td>{person.dniVerified ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => openFormForEdit(person)}><EditButton /></button>
                  <button onClick={() => handleDelete(person.id)}><DeleteButton /></button>
                </td>
              </tr>
            ))}
            {persons.length === 0 && (
              <tr>
                <td colSpan="8">No persons found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>)}

      {formOpen && (
        <div className='data-form'>
          <h2>{formData.id ? 'Edit Person' : 'New Person'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              DNI*:
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                required
                maxLength={12}
                disabled={!!formData.id}
              />
            </label>
            <label>
              Name*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={20}
              />
            </label>
            <label>
              Surnames*:
              <input
                type="text"
                name="surnames"
                value={formData.surnames}
                onChange={handleInputChange}
                required
                maxLength={60}
              />
            </label>
            <label>
              Birth Date*:
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                maxLength={100}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={25}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={70}
              />
            </label>
            <label>
              DNI Verified*:
              <input
                type="checkbox"
                name="dniVerified"
                checked={formData.dniVerified}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Tutored*:
              <input
                type="checkbox"
                name="tutored"
                checked={formData.tutored}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Tutor:
              <select
                name="tutorId"
                value={formData.tutorId}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {tutors && tutors
                  .filter(t => !formData.id || t.id !== formData.id)
                  .map(tutor => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name} {tutor.surnames}
                    </option>
                  ))}
              </select>
            </label>
            <div className='data-form-buttons'>
              {formData.id ? <UpdateButton type="submit" /> : <CreateButton type="submit" />}
              <CancelButton onClick={closeForm}/>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Person;