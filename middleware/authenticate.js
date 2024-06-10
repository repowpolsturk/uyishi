const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'secret_key');
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Token yo'q yoki noto'g'ri.");
    }
};
const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send("Admin ruxsat yo'q.");
    }
    next();
};
module.exports = { authenticate, isAdmin };