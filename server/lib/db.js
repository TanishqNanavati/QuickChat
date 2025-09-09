import mongoose from "mongoose";


export const connectDB = async () => {
    try{

        mongoose.connection.on('connected',()=>console.log("Database connected successfully"));
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    }catch(err){
        console.error("Database connection failed:", err);
    }
}