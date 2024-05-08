const Expense = require('../models/expense');
const User = require('../models/user');
const FileUrl = require('../models/FileUrl')
const sequelize = require('../config/db')
const Userservice = require('../services/userservices');
const UserS3service = require('../services/S3services');



exports.download = async (req, res)=>{
    try{ 
        console.log(req.user);
    const expenses = await Userservice.userservices(req);
    console.log(expenses);
    const id = req.user.id;
    const stringifiedExpense = JSON.stringify(expenses);
    const file = `Expense${id}/${new Date()}.txt`;
    const fileUrl = await UserS3service.S3services(stringifiedExpense, file);
    console.log(fileUrl);
     await FileUrl.create({FileUrl: fileUrl, signupId: id})
    res.status(200).json({fileUrl, success:true});
    }catch(err){
        console.log(err);
        res.status(500).json({ fileUrl: '', success: false, err: err})
    }
}

exports.fileUrl = async(req, res, next)=>{
    try{
        const fileurls = await FileUrl.findAll({where :{signupId: req.user.id}});
        res.status(200).json(fileurls);

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
     }
     
}

exports.postexpense = async(req, res, next) =>{
    const t = await sequelize.transaction();
    console.log(req.body);
    try {
        const [expense, user] = await Promise.all([
            Expense.create({ ...req.body, signupId: req.user.id }, { transaction: t }),
            User.findOne({ where: { id: req.user.id }, transaction: t })
        ]);

        const totalExpense = Number(user.totalexpense) + Number(req.body.amount);
        await user.update({ totalexpense: totalExpense }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Expense Added Successfully", expense: expense });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "Node thing" });
    }
}



exports.getexpense = async (req, res, next) => {
    console.log(req.user);
    try {
        const page = +req.query.page || 1;
        const expensesPerPage = +req.query.limit || 5;
        const offset = (page - 1) * expensesPerPage;

        console.log(offset, expensesPerPage, page)

        // Get total count of expenses
        const totalCount = await Expense.count( {where: { signupId: req.user.id }});
        console.log(totalCount);

        // Fetch expenses for the current page
        const expenses = await Expense.findAll({
            where: { signupId: req.user.id },
            offset: offset,
            limit: expensesPerPage

        });

        console.log(expenses);

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / expensesPerPage);
        console.log(totalPages);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        // Send response
        res.json({
            expenses: expenses,
            totalExpenses: totalCount,
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: hasNextPage,
            hasPreviousPage: hasPreviousPage,
            page: page
            
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteexpense = async(req, res, next) =>{
    const t = await sequelize.transaction();
    
    try {
        const id = req.params.id;

        const [expensetodelete, user] = await Promise.all([
            Expense.findOne({ where: { id: id, signupId: req.user.id } }),
            User.findOne({ where: { id: req.user.id }, include: 'expense' })
        ]);

        if (!expensetodelete) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const amount = expensetodelete.amount;
        await expensetodelete.destroy({ transaction: t });

        if (user.expense.length === 1) {

            await user.update({ totalexpense: 0 }, { transaction: t });
        } else {
            
            const updatedexpense = Number(user.totalexpense) - Number(amount);
            await user.update({ totalexpense: updatedexpense }, { transaction: t });
        }
        
        t.commit();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        t.rollback();
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}