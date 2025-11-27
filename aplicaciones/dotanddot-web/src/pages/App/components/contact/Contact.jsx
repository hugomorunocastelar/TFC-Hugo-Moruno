import React, { useState } from 'react';
import './Contact.css';
import { sendContactEmail } from '../../../../js/home/sendContactEmail';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errs.email = 'Invalid email';
    }
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setStatus('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const result = await sendContactEmail(form.name, form.email, form.message);
      if (result.status === 200) {
        setStatus('Message sent!');
        setForm({ name: '', email: '', message: '' });
      } else if (result.status === 503) {
        setStatus(result.message || 'Service unavailable. Please try again later.');
      } else {
        setStatus('Failed to send. Try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('Failed to send. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <h2>Contact</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        {errors.message && <div className="form-error">{errors.message}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
        {status && <div className="form-status">{status}</div>}
      </form>
    </div>
  );
}

export default Contact

