"use client"

import { useEffect, useState } from 'react';

export default function NoteDiv() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch(`http://localhost:4000/notes/${userId}`);
      const data = await response.json();
      setNotes(data);
    };
    fetchNotes();
  }, [userId]);

  const addNote = async () => {
    if (title.trim() && content.trim()) {
      const response = await fetch('http://localhost:4000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, content }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]); // Add the new note to the state
        setTitle('');
        setContent('');
      } else {
        alert('Failed to add note');
      }
    }
  };

  const deleteNote = async (noteId) => {
    const response = await fetch(`http://localhost:4000/notes/${noteId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setNotes(notes.filter(note => note.id !== noteId));
    } else {
      alert('Failed to delete note');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notes</h1>
      <div className="flex flex-col mb-6 w-full max-w-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black mb-2"
          rows="4"
        />
        <button
          onClick={addNote}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Add Note
        </button>
      </div>
      <ul className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex justify-between items-center p-2 border-b last:border-b-0"
          >
            <div className="flex flex-col">
              <span className="font-bold text-gray-700">{note.title}</span>
              <p className="text-gray-600">{note.content}</p>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

