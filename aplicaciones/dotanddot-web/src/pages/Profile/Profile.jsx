import React, { useEffect, useState } from 'react';
import './Profile.css';
import { getSession, removeSession, saveSession } from '../../js/session.mjs';
import * as http from '../../js/http.js';
import API from '../../js/env.js';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const sessionUser = getSession();
  const [user, setUser] = useState(sessionUser || {});
  const [form, setForm] = useState({ username: '', email: '' });
  
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', email: user.email || '' });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatRole(role) {
    if (!role) return '';
    // remove prefix ROLE_ if present
    const withoutPrefix = role.replace(/^ROLE_/i, '');
    return withoutPrefix.charAt(0).toUpperCase() + withoutPrefix.slice(1).toLowerCase();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setStatus('');
  };

  

  const handleAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    // password change removed from profile form
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const body = { email: form.email };
      const res = await http.put(API.USERS.UPDATE(user.id), body);
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      const updatedSession = { ...sessionUser, ...data };
      saveSession(updatedSession);
      setUser(updatedSession);
      setStatus('Profile updated successfully');
      // password fields removed
    } catch (error) {
      console.error('Profile save error:', error);
      setStatus('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeSession();
    window.location.reload();
  };

  if (!sessionUser) {
    return (
      <div className="profile-container">
        <div className="profile-empty">No user session found.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-title">
          <h2>{capitalize(form.username || user.username)}'s profile</h2>
          <button className='profile-title-button' onClick={() => {navigate('/')}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
            </svg>
          </button>
        </div>
        <div className='profile-content'>
          <div className="profile-left">
            <div className="avatar-wrap">
              <label htmlFor="avatarInput" className="avatar-label">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="avatar" />
                ) : (
                  <div className="avatar-placeholder"></div>
                )}
                <div className="avatar-overlay" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C9.23858 5 7 7.23858 7 10C7 12.7614 9.23858 15 12 15C14.7614 15 17 12.7614 17 10C17 7.23858 14.7614 5 12 5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21C21 17.134 17.866 14 14 14H10C6.13401 14 3 17.134 3 21" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 7H5L6 5H10L11 7H13" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </label>
              <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatar} className="avatar-input" />
            </div>
            <div className="profile-roles">
              <strong>Roles</strong>
              <div className="roles-list">
                {(user.roles && user.roles.length) ? user.roles.map(r => formatRole(r)).join(', ') : 'None'}
              </div>
            </div>
          </div>
          <div className="profile-right">
            <form className="profile-form" onSubmit={handleSave}>
                <div>
                  <div className="profile-username">
                    <label>Username</label>
                    <div className="username-display">{form.username || user.username}</div>
                  </div>
                  <label>
                    Email
                    <input name="email" value={form.email} onChange={handleChange} />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </label>
                </div>
              

              <div className="form-actions">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</button>
                <button type="button" className="cancel-btn" onClick={() => { setForm({ username: user.username, email: user.email }); setErrors({}); setStatus(''); }}>Reset</button>
              </div>
              {status && <div className={`form-status ${status.includes('Failed') ? 'error' : 'success'}`}>{status}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;