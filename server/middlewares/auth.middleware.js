import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async(req,res,next)=>{
    try{
        const token = req.headers.token;

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({success:false,message:"User not found"});
        }

        req.user = user;
        next();
    }catch(err){
        console.error("Authentication failed:", err);
        return res.json({success:false,message:"User authentication failed"});
    }
}