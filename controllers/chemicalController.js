const asyncHandler = require('express-async-handler');
const Chemical = require('../models/chemical');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    const allChemicals = await Chemical.find({}, { groups: 0 }).sort({ name: 1 }).populate('groups').exec();
    res.render('chemical_list', {
      title: 'All Chemicals',
      allChemicals,
    });
  }),

  details_get: asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: GET chemical detail for id ${req.params.id}`);
  }),

  create_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET chemical create form');
  }),

  create_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST chemical create form');
  }),

  update_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET chemical update form');
  }),

  update_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST chemical update form');
  }),

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET chemical delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST chemical delete form');
  }),
};
