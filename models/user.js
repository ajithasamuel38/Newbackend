const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('signups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
        
    Ispremium:{
        type: Sequelize.BOOLEAN
    },

    totalexpense: {
        type: Sequelize.INTEGER,
        defaultValue:0
    }

})

module.exports = User;