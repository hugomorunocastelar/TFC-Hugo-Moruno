import React, { useEffect, useRef, useState } from 'react';
import { del, post, put } from '../../../../js/http';
import { getAllTeams } from '../../../../js/cruds/teams.mjs';
import API from '../../../../js/env';
import { getAllPlayers } from '../../../../js/cruds/players.mjs';
import { getAllPersons } from '../../../../js/cruds/persons.mjs';
import Loader from '../../../Loader/Loader.jsx';
import PlayerTable from './partials/PlayerTable.jsx';
import PlayerForm from './partials/PlayerForm.jsx';
import '../shared-styles.css';

function Player() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [persons, setPersons] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    noShirt: '',
    teamId: '',
    personId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingData, setLoadingData] = useState(true);
  const fetchedRef = useRef(false);

  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlayers = players.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchPlayers = async (force = false) => {
    try {
      if (fetchedRef.current && !force) return;
      fetchedRef.current = true;
      setLoadingData(true);
      getAllPlayers()
        .then((response) => { setPlayers(response || []); setLoadingData(false); })
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
    fetchPlayers();
    fetchTeams();
    fetchPersons();
  }, []);

  function openFormForCreate() {
    setFormData({
      id: null,
      noShirt: '',
      teamId: '',
      personId: '',
    });
    setSelectedPlayer(null);
    setFormOpen(true);
  };

  const openFormForEdit = (player) => {
    setFormData({
      id: player.id,
      noShirt: player.noShirt,
      teamId: player.team ? player.team.id : '',
      personId: player.dni ? player.dni.id : '',
    });
    setSelectedPlayer(player);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedPlayer(null);
    setFormData({
      id: null,
      noShirt: '',
      teamId: '',
      personId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = {
        noShirt: formData.noShirt,
        team: formData.teamId ? { id: formData.teamId } : null,
        dni: formData.personId ? { id: formData.personId } : null,
      };

      if (formData.id) {
        await put(API.PLAYER.UPDATE(formData.id), bodyData);
      } else {
        await post(API.PLAYER.CREATE, bodyData);
      }
      await fetchPlayers(true);
      closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      await del(API.PLAYER.DELETE(id));
      await fetchPlayers(true);
      if (selectedPlayer && selectedPlayer.id === id) closeForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='admin-container'>
      {loadingData ? (
        <Loader />
      ) : formOpen ? (
        <PlayerForm
          formData={formData}
          teams={teams}
          persons={persons}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : (
        <PlayerTable
          currentPlayers={currentPlayers}
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

export default Player;