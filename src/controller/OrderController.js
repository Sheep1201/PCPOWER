const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log dữ liệu nhận được
        const { paymentMethod, totalPrice, fullname, email, phone, address } = req.body;
        if (!paymentMethod || !totalPrice || !fullname || !email || !phone || !address) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }
        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.error('Error:', e); // Log lỗi chi tiết
        return res.status(404).json({
            message: e.message || e
        });
    }
};
const getDetailsOrder = async (req, res) => {
    try{
        const userId = req.params.id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        const response = await OrderService.getDetailsOrder(userId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateOrder = async (req, res) => {
    try{
        const orderId = req.params.id
        const data = req.body
        if(!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The order id is required'
            })
        }
        const response = await OrderService.updateOrder(orderId, data)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteOrder = async (req, res) => {
    try{
        const orderId = req.params.id
        if(!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The order id is required'
            })
        }
        const response = await OrderService.deleteOrder(orderId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder= async (req, res) => {
    try{
        const { limit, page, sort, filter} = req.query
        const response = await OrderService.getAllOrder(Number(limit) , Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getDetailsOrder,
    deleteOrder,
    updateOrder,
    getAllOrder
}