const asyncHandler = require('express-async-handler');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group list');
  }),

  details_get: asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: GET group detail for id ${req.params.id}`);
  }),

  create_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group create form');
  }),

  create_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group create form');
  }),

  update_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group update form');
  }),

  update_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group update form');
  }),

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group delete form');
  }),
};
