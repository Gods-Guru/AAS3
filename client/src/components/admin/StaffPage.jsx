import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    axios.get('http://localhost:5002/api/admin/staff', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setStaff(res.data || []));
  }, []);

  const handleEdit = s => {
    setEditing(s._id);
    setForm({ name: s.name, email: s.email, role: s.role });
  };

  // Add staff to backend
  const handleAdd = async () => {
    try {
      const res = await axios.post('http://localhost:5002/api/admin/staff', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStaff([...staff, res.data]);
      setForm({ name: '', email: '', role: '' });
    } catch (err) {
      // handle error
    }
  };

  // Update staff in backend
  const handleSave = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5002/api/admin/staff/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStaff(staff.map(s => s._id === id ? res.data : s));
      setEditing(null);
    } catch (err) {
      // handle error
    }
  };

  // Delete staff from backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/admin/staff/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStaff(staff.filter(s => s._id !== id));
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="staff-page">
      <h2>Staff Accounts</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s._id}>
              {editing === s._id ? (
                <>
                  <td><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></td>
                  <td><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></td>
                  <td><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></td>
                  <td>
                    <button onClick={() => handleSave(s._id)}>Save</button>
                    <button onClick={() => setEditing(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.role}</td>
                  <td>
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
        <button onClick={handleAdd}>Add Staff</button>
      </div>
    </div>
  );
};

export default StaffPage;