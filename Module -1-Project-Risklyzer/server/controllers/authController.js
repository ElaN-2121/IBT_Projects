const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const register = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = await User.findOne({email});

        if (user) return res.status(400).json({
            message:"User already exists" 
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email, 
            passwordHash: hashedPassword
        });

        await newUser.save()
        const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.status(201).json({ token, user: { id: newUser._id, username, email } });

    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
    

}
const login = async (req, res) => {
    try{
        const {username, email, password }= req.body;
        const user = await User.findOne({email, username})

        if (!user) return res.status(401).json({
            error: "Invalid email or password"
        });

        const match = await bcrypt.compare(password, user.passwordHash);
        
        if (!match) return res.status(401).json({
            error: "Invalid email or username"
        });

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: "4h"});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: 'strict',
            maxAge: 4 * 60 * 60 * 1000
        });

        res.json({ success: true, user: {email: user.email, username: user.username }});
    }
    catch (err) {
        res.status(500).json({ error: err.message});
    }
}

const logout = async (req, res) =>{
    try {
        res.clearCookie('token',  {
            httpOnly: true,
            secure: process.env.NODE_ENV==='production',
            sameSite: 'strict',
        });
        res.json({success: true, message: "Logged out"});

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.me = async (req, res) => {
        const admin = await User.findById(req.userId).select('-passwordHash');
        if (!admin) return res.status(404).json({ error: 'Not found'});
        res.json(admin);
};

module.exports={ register, login, logout};