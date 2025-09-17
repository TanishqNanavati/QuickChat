import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import http from 'http';
import { connect } from 'http2';
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import { Server } from 'socket.io';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "../client/dist")));

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// intitialize socket.io

export const io = new Server(server,{
    cors : {origin : "*"}
});

// store online users

export const userSocketMap = {};

// socket io connection handler

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if(userId) userSocketMap[userId]=socket.id;

    // emit online users to all connected clients

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

app.use(express.json({limit:"4mb"}));

app.use(cors());


// route setup
app.use("/api/status",(req,res)=>{
    res.send("Server is live");
});

app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

await connectDB();

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);

})
