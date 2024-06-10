const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sendOtp = require('../utils/sendOtp');
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({ username, email, password: hashedPassword, status: 'pending', otp });

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
    user.otp = null;
    await user.save();

    return res.status(200).send("Tasdiqlash muvaffaqiyatli va foydalanuvchi aktivlashtirildi.");
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).send("Noto'g'ri foydalanuvchi nomi yoki parol.");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).send("Noto'g'ri foydalanuvchi nomi yoki parol.");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });

    return res.status(200).json({ message: "Muvaffaqiyatli tizimga kirildi.", token });
});

module.exports = router;