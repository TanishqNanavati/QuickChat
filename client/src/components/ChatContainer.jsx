// import React ,{useRef,useEffect, useContext ,useState} from 'react'
// import assets ,{messagesDummyData} from '../assets/assets'
// import {formatMessageTime} from '../lib/utils'
// import { ChatContext } from '../../context/ChatContext'
// import { AuthContext } from '../../context/AuthContext'
// import toast from 'react-hot-toast'

// const ChatContainer = () => {

//     const {messages , selectedUser , setSelectedUser ,sendMessages ,getMessages} = useContext(ChatContext);
//     const {authUser, onlineUsers} = useContext(AuthContext);
//     const scrollEnd = useRef();

//     const [input,setInput] = useState('');

//     // handling sending a message

//     const handleSendMessage = async(e)=>{
//       e.preventDefault();
//       if(input.trim() === "") return null;
//       await sendMessages({text : input.trim()});
//       setInput("");
//     }

//     // handling sending an image

//     const handleSendImage = async(e)=>{
//       const file = e.target.files[0];
//       if(!file || !file.type.startsWith("image/")){
//         toast.error("Select an image file");
//         return ;
//       }

//       const reader = new FileReader();

//       reader.onload = async()=>{
//         await sendMessages({image:reader.result});
//         e.target.value="";
//       }

//       reader.readAsDataURL(file);
//     }

//     useEffect(()=>{
//       if(selectedUser){
//         getMessages(selectedUser._id);
//       }
//     },[selectedUser])

//     useEffect(()=>{
//         if(scrollEnd.current && messages){
//             scrollEnd.current.scrollIntoView({behavior:'smooth'})
//         }
//     },[messages])

    
//   return selectedUser ? (
//     <div className='h-full overflow-scroll relative backdrop-blur-lg'>
//       <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
//         <img src={selectedUser.profilePic || assets.avatar_icon} alt=""  className='w-8 rounded-full'/>
//         <p className='flex-1 text-lg text-white flex items-center gap-2'>
//             {selectedUser.fullName}
//             {onlineUsers.includes(selectedUser._id)} <span className='w-2 h-2 rounded-full bg-green-500'></span>
//         </p>
//         <img 
//         onClick={()=>setSelectedUser(null)}
//         src={assets.arrow_icon} alt="" className='md-hidden max-w-7'></img>
//         <img src={assets.help_icon} alt="" className='md-hidden max-w-5'></img>
//       </div>
//       <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
//         {
//             messages.map((msg,index)=>(
//                 <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
//                     {
//                         msg.image ? 
//                         (<img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'></img>)
//                         :(<p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white
//                             ${msg.senderId === authUser._id ? 'rounded-br-none':'rounded-bl-none'} `}>{msg.text}</p>)
//                     }

//                     <div className = 'text-center text-xs'>

//                         <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic  || assets.avatar_icon} className='w-7 rounded-full'></img>
//                         <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>

//                     </div>

//                 </div>
//             ))
//         }

//         <div ref={scrollEnd}></div>
//       </div>



//       <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 '>
//         <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
//             <input onChange={(e)=>setInput(e.target.value)} value={input} type='text' placeholder='Send a message..' className='flex-1 text-sm p-3 border-none rounded-lg outline-none 
//             text-white placeholder-gray-400'
//             onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null}
//             ></input>
//             <input onChange={(e)=>handleSendImage(e)} type='file' id='image' accept='image/png, image/jpeg' hidden></input>
//             <label htmlFor='image'>
//                 <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer'/>
//             </label>
//         </div>
//         <img src={assets.send_button} className='w-7 cursor-pointer'
//         onClick={handleSendMessage}
//         ></img>
//       </div>
//     </div>
//   ):(
//     <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
//         <img src={assets.logo_icon} className='max-w-16'></img>
//         <p className='text-lg font-medium text-white'>Chat Anytime , Anywhere</p>
//     </div>
//   )
// }

// export default ChatContainer



import React, { useRef, useEffect, useContext, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  // handle sending text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessages({ text: input.trim() });
    setInput('');
  };

  // handle sending image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      await sendMessages({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  // fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  // scroll to bottom on new messages
  useEffect(() => {
    if (scrollEnd.current && messages) scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // find the index of first unread message from the selected user
  const firstUnreadIndex = messages.findIndex(
    (msg) => msg.senderId !== authUser._id && !msg.seen
  );

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          )}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md-hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='md-hidden max-w-5' />
      </div>

      {/* Messages */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <React.Fragment key={msg._id || index}>
            {/* Unread separator */}
            {index === firstUnreadIndex && (
              <div className='flex justify-center my-2'>
                <span className='text-xs bg-gray-700/50 px-2 py-1 rounded text-white'>
                  {messages.filter((m) => m.senderId !== authUser._id && !m.seen).length} unread message
                  {messages.filter((m) => m.senderId !== authUser._id && !m.seen).length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div className={`flex items-end gap-2 ${msg.senderId === authUser._id ? 'flex-row-reverse' : ''}`}>
              {msg.image ? (
                <img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                    msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className='text-center text-xs'>
                <img
                  src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                  className='w-7 rounded-full'
                />
                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            placeholder='Send a message..'
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
            onKeyDown={(e) => (e.key === 'Enter' ? handleSendMessage(e) : null)}
          />
          <input onChange={handleSendImage} type='file' id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor='image'>
            <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <img src={assets.send_button} className='w-7 cursor-pointer' onClick={handleSendMessage} />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat Anytime, Anywhere</p>
    </div>
  );
};

export default ChatContainer;
