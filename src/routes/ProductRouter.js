const express = require("express");
const router = express.Router();
const ProductController = require('../controller/ProductController');


router.post('/create', ProductController.createProduct)
router.put('/update/:id', ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.delete('/delete/:id', ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)

module.exports = router