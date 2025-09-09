import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';


// SignUp new User

export const signup = async(req,res)=>{
    const {fullName,email,password,bio} = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success:false,message:"Please fill all the fields"});  
        }

        const user = await User.findOne({email});

        if(user){
            return res.json({success:false,message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        res.json({success:true,userData:newUser,token,message:"User created successfully"});

    }catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});
    }
}


// Login User

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.json({success:false,message:"Please provide email and password"});
        }

        const userData = await User.findOne({email});

        if(!userData){
            return res.json({success:false,message:"User does not exist"});
        }

        const isPasswordValid = await bcrypt.compare(password,userData.password);

        if(!isPasswordValid){
            return res.json({success:false,message:"Invalid credentials"});
        }

        const token = generateToken(userData._id);

        res.json({success:true,userData,token,message:"User logged in successfully"});


    }catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});
    }
}

// to check user authentication

export const checkAuth = (req,res) =>{
    res.json({success:true,user:req.user,message:"User is authenticated"});
}


// to update user profile

// export const updateProfile = async(req,res)=>{

//     try{
//         const {profilePic,bio,fullName} = req.body;

//         if(!profilePic || !bio || !fullName){
//             return res.json({success:false,message:"Please fill all the fields"});
//         }

//         const userId = req.user._id;
//         let updatedUser;
        
//         if(!profilePic){
//            updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
//         }
//         else{
//             const upload = await cloudinary.uploader.upload(profilePic);

//             updatedUser = await User.findByIdAndUpdate(userId,
//                 {
//                     profilePic:upload.secure_url,
//                     bio,
//                     fullName
//                 },{new:true}
//             );
//         }

//         res.json({success:true,user:updatedUser,message:"User profile updated successfully"});
//     }catch(err){
//         console.log("Error in updating profile:", err);
//         res.json({success:false,message:"Error in updating the profile"});
//     }

// } 

export const updateProfile = async(req,res)=>{
    try{
        const {profilePic,bio,fullName} = req.body;
        if(!bio || !fullName){
            return res.json({success:false,message:"Please fill all the fields"});
        }

        const userId = req.user._id;
        let updatedData = { bio, fullName };

        if(profilePic){
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedData.profilePic = upload.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        res.json({success:true, user: updatedUser, message:"User profile updated successfully"});
    }catch(err){
        console.log("Error in updating profile:", err);
        res.json({success:false,message:"Error in updating the profile"});
    }
}
