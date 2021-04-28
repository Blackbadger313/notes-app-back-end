const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload; // POST request from client
  const createdAt = new Date().toISOString(); // Generate date with ISO standart
  const updatedAt = createdAt; // Also same
  const id = nanoid(16); // Generate id with 3rd party module name 'nanoid'

  const newNote = {
    title, tags, body, id, createdAt, updatedAt, // Create newNote Object
  };

  notes.push(newNote); // Push the newNote object into notes.js

  const isSuccess = notes.filter(
    (note) => note.id === id,
  ).length > 0; // Verification is that the note already there?

  // Return response
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Note berhasil di tambahkan',
      data: {
        noteId: id,
      },
    })
      .code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Note gagal ditambahkan',
  })
    .code(500);
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0]; // feedback data dari filter berupa array

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  return h.response({
    status: 'fail',
    message: 'Note tidak ditemukan',
  })
    .code(404);
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    /*
    sourcode dibawah akan menimpa data objek pada array notes[index]
    dengan nilai input dari spread operator
    ...notes[index], kemudian data hasil input spread operator
    dengan key title, tags, body, dan updatedAt
    akan di gantikan nilainya oleh variable title, tags, dan body
    hasil output dari request.payload
    */

    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Note berhasil di edit',
    })
      .code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Note gagal di edit',
  })
    .code(404);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Note berhasil dihapus',
    })
      .code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Note gagal dihapus',
  })
    .code(404);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
