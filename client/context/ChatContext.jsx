import { createContext, useContext, useEffect, useState } from "react";
import {AuthContext} from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL ;
axios.defaults.baseURL = backendUrl;
console.log(backendUrl);

export const ChatProvider = ({children})=>{

    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);
    const [unSeenMessages,setUnseenMessages] = useState({}); // user id and no of messages {key,value} pair

    const {socket,axios} = useContext(AuthContext);

    // function to get users from sidebar

    const getUsers = async()=>{
        try{
            const {data} = await axios.get("/api/messages/users");

            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unSeenMessages || {});
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // function to get messages of selected User


    const getMessages = async(userId)=>{
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);

            if(data.success){
                setMessages(data.messages);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // function to send message to selected User

    const sendMessages = async(messageData)=>{
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);

            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage]);
            }
            else{
                toast.error(error.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // function to subscribe to messages of selected user

    const subscribeToMessages = async()=>{
        if(!socket) return ;

        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;

                setMessages((prevMessages)=>[...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,
                    [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1 
                }));
            }
        })
    }

    // function to unsubscribe from messages

    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket,selectedUser])


    const value ={
        messages,
        users,
        selectedUser,
        getUsers,
        sendMessages,
        getMessages,
        setSelectedUser,
        unSeenMessages,
        setUnseenMessages,
    }

    return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}
