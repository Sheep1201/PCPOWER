const express = require("express");
const router = express.Router();
const OrderController = require('../controller/OrderController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");


router.post('/create', OrderController.createOrder)
router.get('/get-order-details/:id', OrderController.getDetailsOrder)
router.put('/update-order/:id', OrderController.updateOrder)
router.delete('/delete-order/:id', OrderController.deleteOrder)
router.get('/get-all-order', OrderController.getAllOrder)

module.exports = router