const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let notes = []; // In-memory storage

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // API Routes
  server.get("/api/notes", (req, res) => {
    res.json(notes);
  });

  server.post("/api/notes", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Note text is required" });
    const note = { id: Date.now(), text };
    notes.push(note);
    res.status(201).json(note);
  });

  server.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    notes = notes.filter(note => note.id !== id);
    res.json({ message: "Note deleted" });
  });

  // Let Next.js handle everything else
  server.all("*", (req, res) => handle(req, res));

  const port = 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
});