const {
  handleInsertBook,
  handleGetAllBook,
  handleGetBookDetails,
  handleUpdateBook,
  handleDeleteBook,
} = require('./handlers');

module.exports = (server) => {
  server.route({
    method: 'POST',
    path: '/books',
    handler: handleInsertBook,
  });

  server.route({
    method: 'GET',
    path: '/books',
    handler: handleGetAllBook,
  });

  server.route({
    method: 'GET',
    path: '/books/{id}',
    handler: handleGetBookDetails,
  });

  server.route({
    method: 'PUT',
    path: '/books/{id}',
    handler: handleUpdateBook,
  });

  server.route({
    method: 'DELETE',
    path: '/books/{id}',
    handler: handleDeleteBook,
  });
};
