const User = require('../models/user');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postuserdetails = async(req, res, next) => {
    
    try{
        const {name, email, password} = req.body;
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash)=>{
            console.log(err);
            await User.create({name, email, password: hash});
            res.status(201).json({message: "User created successfully"});
        })
        }catch(err){
            if (err instanceof Sequelize.UniqueConstraintError) {
                // Unique constraint violation (e.g., email already exists)
                res.status(400).json({ message: "Email already exists", err });
            } else {
                console.error("Error creating user:", err);
                res.status(500).json({ message: "Internal server error" });
            }
        }
}
function generateAccessToken(id){
    return jwt.sign({signupId: id}, "secretkey")
}
exports.userlogindetails = async (req, res, next)=>{

    console.log(req.body);
    const {email, password} = req.body;
   
    try{
       

        const user  = await User.findOne({where: {email: email}});

        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    throw new error ("User does not exist");
                }
            
            if (result===true) {
                res.status(200).json({ message: "User logged in Successfully", token: generateAccessToken(user.id) });
            } else {
                res.status(401).json({ message: "Password is incorrect" });
            }
            
        })
    }     else{
            
                res.status(404).json({message: "User not found"});
        }
        
        }
        catch (err){
            console.error("Error logging in user:", err);
        res.status(500).json({ message: "Internal server error" });
        }
}