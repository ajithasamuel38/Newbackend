const Razorpay = require('razorpay');
const Order = require('../models/orders');
require('dotenv').config();


exports.purchase = async(req, res) =>{
    try{
        var rzp = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
        })
        const amount =2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) =>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status:'PENDING'}).then(()=>{
                return res.status(201).json({order, key_id: rzp.key_id});
            }).catch(err=>{
                console.log(err)
            })
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateTransactionstatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;


        // Find the order and update its status
        const orderPromise = Order.findOne({ where: { orderid: order_id } })
            .then(order => {
                return order.update({ paymentId: payment_id, status: 'SUCCESSFUL' });
            });

        // Update the user's premium status
        const userPromise = req.user.update({ Ispremium: true });

        console.log(userPromise);

        // Wait for both promises to resolve
        await Promise.all([orderPromise, userPromise]);

        return res.status(202).json({ success: true, message: "Transaction successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.checkPremiumStatus = async (req, res) => {
    try {
        // Assuming the user's premium status is stored in req.user.ispremiumuser
        const isPremium = req.user.Ispremium;
        return res.status(200).json({ isPremium });
    } catch (error) {
        console.error("Error checking premium status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
