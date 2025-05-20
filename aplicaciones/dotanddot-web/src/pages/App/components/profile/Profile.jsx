import React from 'react'
import './Profile.css';

function Profile({ user, closeSession }) {

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (!user) {
    return <div className="profile-container">No user data available.</div>;
  }

  return (
    <div className="profile-container">
      <div className='profile-title-container'>
        <h2 className="profile-title">{capitalize(user.username)}'s profile</h2>
      </div>
      <div className='profile-fields-container'>
        <div className="profile-field">
          <span className="label">User:</span> {user.username}
        </div>
        <div className="profile-field">
          <span className="label">Email:</span> {user.email}
        </div>
        <div className="profile-field">
          <span className="label">Roles:</span> {user.roles?.length ? user.roles.join(', ') : 'Ninguno'}
        </div>
        <button onClick={closeSession}>
          Close session
        </button>
      </div>
    </div>
  );
}


export default Profile