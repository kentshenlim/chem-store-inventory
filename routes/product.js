const express = require('express');
const controller = require('../controllers/productController');

const router = express.Router();

router.get('/', controller.list_get);

router.get('/page:page', controller.list_get); // Must come before /:id

router.get('/create', controller.create_get);

router.post('/create', controller.create_post);

router.get('/:id', controller.details_get);

router.get('/:id/update', controller.update_get);

router.post('/:id/update', controller.update_post);

router.get('/:id/delete', controller.delete_get);

router.post('/:id/delete', controller.delete_post);

router.get('/:id/sds', controller.sds_get);

module.exports = router;
