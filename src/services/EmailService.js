const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
const sendEmailCreateOrder = async (email, fullname, cartItems, totalPrice, paymentMethod, address, phone) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // Function to format numbers with commas as thousands separators
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let listItem = `
<table border="1" cellspacing="0" cellpadding="10">
    <thead>
        <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá thành (VND)</th>
        </tr>
    </thead>
    <tbody>`;

    cartItems.forEach((order) => {
        listItem += `<tr>
        <td>${order.name}</td>
        <td>${order.amount}</td>
        <td>${formatNumberWithCommas(order.price)} VND</td>
    </tr>`;
    });

    listItem += `</tbody>
    <tfoot>
        <tr>
            <td colspan="2"><b>Tổng cộng</b></td>
            <td><b>${formatNumberWithCommas(totalPrice)} VND</b></td>
        </tr>`;

    // Kiểm tra giá trị của paymentMethod và tạo phần tử HTML tương ứng
    if (paymentMethod === 1) {
        listItem += `<tr>
            <td colspan="2"><b>Phương thức nhận hàng</b></td>
            <td><b>nhận tại cửa hàng</b></td>
        </tr>`;
    } else if (paymentMethod === 2) {
        listItem += `<tr>
            <td colspan="2"><b>Phương thức nhận hàng</b></td>
            <td><b>Giao đến: ${address}</b></td>
        </tr>`;
    }

    listItem += `<tr>
            <td colspan="2"><b>Số điện thoại</b></td>
            <td><b>${phone}</b></td>
        </tr>
    </tfoot>
</table>`;

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT, // sender address
            to: email, // list of receivers
            subject: "Đặt hàng thành công tại PCPOWER✔", // Subject line
            // text: "Hello world?",  plain text body
            html: `<b>Cảm ơn ${fullname} đã đặt hàng tại PCPOWER, đơn hàng bao gồm:</b><div>${listItem}</div><div><hr/>PCPOWER</div>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
}

module.exports = {
    sendEmailCreateOrder
}
