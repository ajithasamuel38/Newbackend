const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) =>{
     try{ 

        const token = req.header("Authorization");
        console.log(token);
        const user  = jwt.verify(token, 'secretkey');
        console.log(user);
        User.findByPk(user.signupId).then( user =>{
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        })

     }catch(err){
        console.log(err);
        return res.status(500).json({message: "Node thing"});
     }
}