// import nanoid dari package-nya
const { nanoid } = require('nanoid');

// impor array notes pada berkas handler.js
const notes = require('./notes');

// fungsi handler pada Hapi memiliki dua parameter
const addNoteHandler = (request, h) => {
    // client mengirim data catatan (title, tags, dan body) yang akan disimpan dalam bentuk JSON melalui body request
    const { title, tags, body } = request.payload;

    // memanggil method nanoid() dan memberikan parameter number yang merupakan ukuran dari string-nya
    const id = nanoid(16);

    // karena kasus sekarang adalah menambahkan catatan baru, berarti nilai kedua properti tersebut seharusnya sama --> mknya pake new Date().toISOString();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    /*  Kita sudah memiliki properti dari objek catatan secara lengkap
        Sekarang, saatnya kita masukan nilai-nilai tersebut ke dalam array notes menggunakan method push() */
    const newNote = {
        title,
        tags,
        body,
        id,
        createdAt,
        updatedAt,
    };

    notes.push(newNote);

    /*  Menentukan apakah newNote sudah masuk ke dalam array notes
        Kita bisa memanfaatkan method filter() berdasarkan id catatan untuk mengetahuinya */
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    /*  kita gunakan isSuccess untuk menentukan respons yang diberikan server. 
        Jika isSuccess bernilai true, silakan beri respons berhasil. 
        Jika false, silakan beri respons gagal  */
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

/*  dapatkan dulu nilai id dari request.params
    Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari objek array notes
*/
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    // Manfaatkan method array filter() untuk mendapatkan objeknya
    const note = notes.filter((n) => n.id === id)[0];

    /*  kembalikan fungsi handler dengan data beserta objek note di dalamnya 
        pastikan dulu objek note tidak bernilai undefined
    */
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;

};

const editNoteByIdHandler = (request, h) => {
    /*  Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter. 
        Jadi, kita perlu mendapatkan nilai id-nya terlebih dahulu.
    */
    const { id } = request.params;

    // dapatkan data notes terbaru yang dikirimkan oleh client melalui body request
    const { title, tags, body } = request.payload;

    /*  perbarui juga nilai dari properti updatedAt
        Jadi, dapatkan nilai terbaru dengan menggunakan new Date().toISOString()
    */
    const updatedAt = new Date().toISOString();

    /*  saatnya mengubah catatan lama dengan data terbaru,
        kita akan mengubahnya dengan memanfaatkan indexing array.
        dapatkan index array pada objek catatan sesuai id yang ditentukan menggunakan method array findIndex()
    */
    const index = notes.findIndex((note) => note.id === id);

    /*  Bila note dengan id yang dicari ditemukan, index akan bernilai array index dari 
    objek catatan yang dicari. Namun, bila tidak ditemukan, index akan bernilai -1. 
        Jadi, kita bisa menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else.
    */
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    // dapatkan dulu nilai id yang dikirim melalui path parameter
    const { id } = request.params;

    // dapatkan index dari objek catatan sesuai dengan id yang didapat
    const index = notes.findIndex((note) => note.id === id);

    /*  Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan 
        Untuk menghapus data pada array berdasarkan index, gunakan method array splice()
    */
    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    // Bila index bernilai -1, kembalikan handler dengan respons gagal
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};



/*  untuk mengekspor fungsi handler, kita gunakan objek literals bertujuan 
    untuk memudahkan ekspor lebih dari satu nilai pada satu berkas JavaScript.
*/
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler, };