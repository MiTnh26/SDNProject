import express from 'express';
import PayOS from '@payos/node';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js'; // Điều chỉnh đường dẫn tùy theo cấu trúc thư mục của bạn

dotenv.config();

const router = express.Router();

const payos = new PayOS("bf5f0eaf-610c-44c0-b622-f77ccd209389",
    "48038d7f-c9ec-44f5-9133-453065493a6a",
    "668615efa053dfcafba201e6710972b9c98adf34776b52d25461eb67c6de352d");

router.post('/create-payment-link', async (req, res) => {
    const { amount, bookingId } = req.body;
    const YOUR_DOMAIN = process.env.REACT_URL;

    try {
        // Kiểm tra xem bookingId đã tồn tại trong hệ thống hay chưa (vd: từ cơ sở dữ liệu)

        const order = {
            amount: amount * 10,
            description: bookingId, // Mô tả ví dụ
            orderCode: Math.floor(10000000 + Math.random() * 90000000), // Tạo mã đơn hàng ngẫu nhiên 8 chữ số
            returnUrl: `${YOUR_DOMAIN}/success`,
            cancelUrl: `${YOUR_DOMAIN}/cancel`,
        };

        const paymentLink = await payos.createPaymentLink(order);

        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error("Error creating payment link:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/payment/success', async (req, res) => {
    const { bookingId } = req.body;

    try {
        // Cập nhật trạng thái của payment trong cơ sở dữ liệu
        const payment = await Payment.findOneAndUpdate(
            { bookingId },
            { status: 'confirmed' },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json({ message: 'Booking confirmed successfully' });
    } catch (error) {
        console.error("Error confirming booking:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
