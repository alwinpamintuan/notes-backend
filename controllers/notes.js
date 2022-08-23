import express from "express";
import Note from "../models/note.js";

const notesRouter = express.Router();

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((err) => next(err));
});

notesRouter.put("/:id", (req, res, next) => {
  const { content, important } = req.body;

  /* updatedNote is the original document by default
     - {new: true} parameter solves this by giving the new modified document instead

     findByIdAndUpdate does not run validation by default
     - update config by setting runValidators to true and context: 'query' (for tech reasons)
  */
  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((err) => next(err));
});

export default notesRouter;
