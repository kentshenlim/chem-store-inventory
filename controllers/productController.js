const asyncHandler = require('express-async-handler');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product list');
  }),

  details_get: asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: GET product detail for id ${req.params.id}`);
  }),

  create_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product create form');
  }),

  create_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST product create form');
  }),

  update_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product update form');
  }),

  update_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST product update form');
  }),

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST product delete form');
  }),
};
