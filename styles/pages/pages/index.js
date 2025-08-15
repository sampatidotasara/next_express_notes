import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const addNote = async () => {
    if (!text.trim()) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const newNote = await res.json();
    setNotes(prev => [...prev, newNote]);
    setText("");
  };

  const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📒 Notes App (Next.js + Express.js)</h1>

      <div>
        <input
          type="text"
          value={text}
          placeholder="Enter a note"
          onChange={e => setText(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.text}{" "}
            <button onClick={() => deleteNote(note.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}