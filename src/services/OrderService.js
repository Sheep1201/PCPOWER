const Order = require("../models/orderModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const Product = require("../models/ProductModel")
const EmailSevice = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { cartItems, paymentMethod, totalPrice, fullname, email, phone, address, user } = newOrder;

        // Gắn cờ trạng thái để kiểm soát việc thực hiện hàm
        let isOrderCreated = false;

        try {
            // Tạo danh sách các promise để cập nhật sản phẩm
            const promises = cartItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount },  // Kiểm tra số lượng tồn kho
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                );
                if (!productData) {
                    throw new Error(`Sản phẩm ${order.product} đã hết hàng hoặc không tồn tại.`);
                }
            });

            // Chờ tất cả các promise cập nhật sản phẩm hoàn thành
            await Promise.all(promises);

            // Kiểm tra cờ trạng thái trước khi tạo đơn hàng
            if (!isOrderCreated) {
                isOrderCreated = true;

                // Tạo đơn hàng nếu tất cả các cập nhật sản phẩm thành công
                const createdOrder = await Order.create({
                    cartItems,
                    shippingAddress: {
                        fullname,
                        email,
                        phone,
                        address,
                    },
                    paymentMethod,
                    totalPrice,
                    user: user
                });

                // Gửi email xác nhận
                await EmailSevice.sendEmailCreateOrder(email, fullname, cartItems, totalPrice, paymentMethod, address, phone);

                resolve({
                    status: 'OK',
                    message: 'Thành công',
                    data: createdOrder
                });
            }
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message,
                data: null
            });
        }
    });
};




const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findOne({
                _id: id
            })
            if (checkOrder === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Success',
                data: updatedOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id).populate('cartItems.product');

            if (!order) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                });
                return;
            }

            // Duyệt qua từng cartItem trong đơn hàng
            for (const cartItem of order.cartItems) {
                const product = cartItem.product;
                const amount = cartItem.amount;

                // Cập nhật countInStock và selled của sản phẩm tương ứng
                await Product.findByIdAndUpdate(product._id, {
                    $inc: {
                        countInStock: amount,
                        selled: -amount
                    }
                });
            }

            await Order.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete order success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrder = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalOrder = await Order.countDocuments()
            if (filter) {
                const label = filter[0]
                const allObjectFilter = await Order.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalOrder,
                    page: Number(page + 1),
                    totalPage: Math.ceil(totalOrder / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allOrderSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allOrderSort,
                    total: totalOrder,
                    page: Number(page + 1),
                    totalPage: Math.ceil(totalOrder / limit)
                })
            }
            const allOrder = await Order.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder,
                total: totalOrder,
                page: Number(page + 1),
                totalPage: Math.ceil(totalOrder / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createOrder,
    getDetailsOrder,
    deleteOrder,
    updateOrder,
    getAllOrder
}