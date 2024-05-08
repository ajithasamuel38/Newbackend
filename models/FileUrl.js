const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Fileurl = sequelize.define('fileurl', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    FileUrl: Sequelize.STRING
})

module.exports = Fileurl;