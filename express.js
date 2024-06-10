const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
const sendOtp = require('./utils/sendOtp');
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username.length < 3 || password.length < 6) {
        return res.status(400).send("Noto'g'ri ma'lumot.");
    }
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).send("Email allaqachon mavjud.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, status: 'pending' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtp(email, otp);
    return res.status(201).send("Foydalanuvchi yaratildi va emailga OTP yuborildi.");
});
router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp) {
        return res.status(400).send("Noto'g'ri OTP yoki email.");
    }
    user.status = 'active';
    await user.save();

    return res.status(200).send("Tasdiqlash muvaffaqiyatli va foydalanuvchi aktivlashtirildi.");
});
module.exports = router;