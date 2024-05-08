const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('sequelize');


exports.getleaderboarddetails = async (req, res) =>{
    try{
        const leaderboard = await User.findAll({
            attributes: ['id', 'name', 'totalexpense'],
            order: [['totalexpense', 'DESC']]
        });
        res.json(leaderboard);
    }catch(err){
        console.log(err);
    }
}