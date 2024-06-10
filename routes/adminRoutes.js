const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, isAdmin } = require('../middleware/authenticate');
router.get('/users', authenticate, isAdmin, async (req, res) => {
    const users = await User.findAll();

    return res.status(200).json(users);
});
router.put('/users/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const user = await User.findOne({ where: { id } });
    if (!user) {
        return res.status(404).send("Foydalanuvchi topilmadi.");
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();

    return res.status(200).send("Foydalanuvchi yangilandi.");
});
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
        return res.status(404).send("Foydalanuvchi topilmadi.");
    }
    await user.destroy();

    return res.status(200).send("Foydalanuvchi o'chirildi.");
});
module.exports = router;