// to get all user except logged in user

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from "../server.js";
import mongoose from "mongoose";

export const getUsersForSidebar = async(req,res)=>{
    try{
        const userId = req.user._id;

        const filteredUsers = await User.find({_id : {$ne : userId}}).select("-password");
        const unSeenMessages = {};

        const promises = filteredUsers.map(async(user)=>{
            const messages = await Message.find({senderId : user._id , receiverId : userId , seen : false});

            if(messages.length > 0){
                unSeenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);

        res.json({success:true,users:filteredUsers,unSeenMessages});

    }catch(err){
        console.error("Error fetching users for sidebar:", err);
        res.json({success:false,message:err.message});
    }
}

export const getMessages = async(req,res)=>{
    try{
        const {id : selectedUserId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId : userId , receiverId : selectedUserId},
                {senderId : selectedUserId , receiverId : userId}
            ]
        })

        await Message.updateMany({senderId: selectedUserId , receiverId : userId},{seen : true});
        
        res.json({success:true,messages}); 

    }catch(err){
        console.error("Error fetching messages:", err);
        res.json({success:false,message:err.message});
    }
}

// to mark the message as seen

export const markMessageAsSeen = async(req,res)=>{
    try{

        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid message ID" });
        }


        await Message.findByIdAndUpdate(id,{seen:true},{new:true});

        res.json({success:true,message:"Message marked as seen successfully"});

    }catch(err){
        console.error("Error marking messages as seen :", err);
        res.json({success:false,message:err.message});
    }
}


// send message to selected User

export const sendMessage = async(req,res)=>{
    try{

        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if(!text && !image){
            return res.json({success:false,message:"Please provide text or image"});
        }

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl || null,
        });

        // emit the new message to the receiver socket 
        
        const receiverSocketId  = userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.json({success:true,newMessage});

    }catch(err){
        console.error("Error sending the messages :", err);
        res.json({success:false,message:err.message});
    }
}