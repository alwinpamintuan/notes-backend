import express from "express";
import cors from "cors";
import notesObj from "./notes.json" assert { type: "json" };

const app = express();
app.use(express.json());
app.use(cors());

let { notes } = notesObj;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) res.json(note);
  else {
    console.log(note);
    res.statusMessage = `Note ${id} does not exist.`;
    res.status(404).end(); // Send NOT FOUND and respond without any data (end)
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const generateId = (arr) => {
  const maxId = arr.length > 0 ? Math.max(...arr.map((n) => n.id)) : 0;
};

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    // 400 BAD REQUEST
    return res.status(400).json({
      error: "Content missing.",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(notes),
  };

  notes = notes.concat(note);

  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
