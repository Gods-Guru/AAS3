import React from 'react';

const ConfirmDelete = ({ open, setOpen, title, message, onConfirm }) => {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <h3 style={{marginTop:0}}>{title || 'Confirm Deletion'}</h3>
        <p className="text-sm text-muted-foreground">{message || 'Are you sure you want to delete this item?'}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button onClick={() => setOpen(false)} style={{ padding: '6px 16px' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '6px 16px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 4 }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;