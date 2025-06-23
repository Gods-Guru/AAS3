import React, { useEffect, useState } from 'react';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../services/productService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [message, setMessage] = useState('');

  const getCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory);
      setNewCategory('');
      setMessage('Category added!');
      getCategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Add failed');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const handleUpdate = async (cat) => {
    try {
      await updateCategory(cat._id, editingName);
      setEditingId(null);
      setEditingName('');
      setMessage('Category updated!');
      getCategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(cat._id);
      setMessage('Category deleted!');
      getCategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(''), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Categories Management</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="New category name"
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>
      {message && <div style={{ color: '#e74c3c', marginBottom: 8 }}>{message}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(cat => (
          <li key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            {editingId === cat._id ? (
              <>
                <input
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={() => handleUpdate(cat)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ flex: 1 }}>{cat.name}</span>
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
