const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('qarzdaftari', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    otp: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
});
const Debt = sequelize.define('Debt', {
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'new'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
User.hasMany(Debt, { foreignKey: 'userId' });
Debt.belongsTo(User, { foreignKey: 'userId' });
sequelize.sync();
module.exports = { User, Debt, sequelize };