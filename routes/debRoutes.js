const express = require('express');
const router = express.Router();
const { Debt } = require('../models');
const { authenticate } = require('../middleware/authenticate');
router.post('/', authenticate, async (req, res) => {
    const { amount, description, due_date, status } = req.body;
    if (!amount || !description || !due_date || !status) {
        return res.status(400).send("Noto'g'ri ma'lumot.");
    }
    const newDebt = await Debt.create({ amount, description, due_date, status, userId: req.user.id });
    return res.status(201).send("Yangi qarz qo'shildi.");
});
router.get('/', authenticate, async (req, res) => {
    const { status } = req.query;
    const query = { userId: req.user.id };
    if (status) query.status = status;
    const debts = await Debt.findAll({ where: query });
    return res.status(200).json(debts);
});
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { amount, description, due_date, status } = req.body;
    const debt = await Debt.findOne({ where: { id, userId: req.user.id } });
    if (!debt) {
        return res.status(404).send("Qarz topilmadi.");
    }
    if (amount) debt.amount = amount;
    if (description) debt.description = description;
    if (due_date) debt.due_date = due_date;
    if (status) debt.status = status;
    await debt.save();
    return res.status(200).send("Qarz yangilandi.");
});

router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const debt = await Debt.findOne({ where: { id, userId: req.user.id } });
    if (!debt) {
        return res.status(404).send("Qarz topilmadi.");
    }
    await debt.destroy();
    return res.status(200).send("Qarz o'chirildi.");
});
module.exports = router;