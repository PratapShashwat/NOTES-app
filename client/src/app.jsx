import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);

  // If token exists, fetch notes
  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const authHeader = { headers: { Authorization: token } };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`, authHeader);
      setNotes(res.data);
    } catch (err) {
      alert("Session expired");
      logout();
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/register' : '/login';
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, form);
      if (!isRegistering) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        alert("Registration successful! Please login.");
        setIsRegistering(false);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  const saveNote = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/notes/${editId}`, newNote, authHeader);
      } else {
        await axios.post(`${API_URL}/notes`, newNote, authHeader);
      }
      setNewNote({ title: '', content: '' });
      setEditId(null);
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const deleteNote = async (id) => {
    if(!confirm("Are you sure?")) return;
    await axios.delete(`${API_URL}/notes/${id}`, authHeader);
    fetchNotes();
  };

  const editNote = (note) => {
    setNewNote({ title: note.title, content: note.content });
    setEditId(note._id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setNotes([]);
  };

  // --- RENDER LOGIN/REGISTER ---
  if (!token) {
    return (
      <div className="container" style={{ marginTop: '50px', maxWidth: '400px' }}>
        <div className="card">
          <h2>{isRegistering ? "Sign Up" : "Login"}</h2>
          <form onSubmit={handleAuth}>
            <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
            <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit" style={{width: '100%'}}>{isRegistering ? "Register" : "Login"}</button>
          </form>
          <p style={{textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: 'blue'}} 
             onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "Need an account? Sign Up"}
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="container">
      <div className="header">
        <h1>My Notes</h1>
        <button onClick={logout} className="secondary">Logout</button>
      </div>

      <div className="card">
        <h3>{editId ? "Edit Note" : "Add New Note"}</h3>
        <form onSubmit={saveNote}>
          <input placeholder="Title" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} required />
          <textarea placeholder="Content" value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} rows="3" required />
          <button type="submit">{editId ? "Update Note" : "Add Note"}</button>
          {editId && <button type="button" className="secondary" style={{marginLeft:'10px'}} onClick={() => {setEditId(null); setNewNote({title:'', content:''})}}>Cancel</button>}
        </form>
      </div>

      <div className="list">
        {notes.map(note => (
          <div key={note._id} className="card note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small style={{color: '#888'}}>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
            <div style={{marginTop: '10px'}}>
              <button onClick={() => editNote(note)} className="secondary">Edit</button>
              <button onClick={() => deleteNote(note._id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;