// import fungsi addNoteHandler
const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler, } = require('./handler');

//  agar web server dapat menyimpan catatan, ia perlu menyediakan route dengan path ‘/notes’ dan method ‘POST’
const routes = [{
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler,
    },
    {
        method: 'GET',
        path: '/notes',
        // Gunakan fungsi handler tersebut pada konfigurasi route.
        handler: getAllNotesHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNoteByIdHandler,
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNoteByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNoteByIdHandler,
    },
];

// agar routes dapat digunakan oleh berkas server.js nantinya
module.exports = routes;