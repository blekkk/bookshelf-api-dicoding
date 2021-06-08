const { nanoid } = require('nanoid');
const books = require('./books');

const handleInsertBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: readPage === pageCount,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }
  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const handleGetAllBookQuery = (request) => {
  const { name, reading, finished } = request.query;
  let resultOneQuery = [];
  let resultMultiQuery = [];
  let allBook = [];
  let nameBook = [];
  let readingBook = [];
  let finishedBook = [];

  if (name) {
    nameBook = books.filter((book) => {
      if (book.name.toLowerCase().includes(name.toLowerCase())) {
        return true;
      }
      return false;
    }).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  }

  if (reading) {
    readingBook = books.filter((book) => {
      if (reading === '1') {
        if (book.reading) {
          return true;
        }
        return false;
      }
      if (reading === '0') {
        if (!book.reading) {
          return true;
        }
        return false;
      }
      return false;
    }).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  }

  if (finished) {
    finishedBook = books.filter((book) => {
      if (finished === '1') {
        if (book.finished) {
          return true;
        }
        return false;
      }
      if (finished === '0') {
        if (!book.finished) {
          return true;
        }
        return false;
      }
      return false;
    }).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  }

  allBook = [...nameBook, ...readingBook, ...finishedBook];
  const map = new Map();
  allBook.forEach((elem) => map.set(elem.id, (map.get(elem.id) || 0) + 1));
  resultMultiQuery = allBook.filter((elem) => map.get(elem.id) > 1);
  if (resultMultiQuery.length > 0) {
    return resultMultiQuery.reduce((unique, o) => {
      if (!unique.some((obj) => obj.id === o.id)) {
        unique.push(o);
      }
      return unique;
    }, []);
  }
  resultOneQuery = allBook.filter((elem) => map.get(elem.id) === 1);
  return resultOneQuery;
};

const handleGetAllBook = (request, h) => {
  const { name, reading, finished } = request.query;
  let allBook = [];

  allBook = handleGetAllBookQuery(request);
  if (!name && !reading && !finished) {
    allBook = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  }

  return h.response({
    status: 'success',
    data: {
      books: allBook,
    },
  }).code(200);
};

const handleGetBookDetails = (request, h) => {
  const { id } = request.params;

  const book = books.find((elem) => elem.id === id);

  if (book) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const handleUpdateBook = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const bookIndex = books.findIndex((book) => book.id === id);
  const updatedAt = new Date().toISOString();

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: readPage === pageCount,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const handleDeleteBook = (request, h) => {
  const { id } = request.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  handleInsertBook,
  handleGetAllBook,
  handleGetBookDetails,
  handleUpdateBook,
  handleDeleteBook,
};
