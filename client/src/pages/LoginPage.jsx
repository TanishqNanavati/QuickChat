import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [bio, setBio] = useState("");

  const {login} = useContext(AuthContext);

  const OnSubmitHandler = (event)=>{
    event.preventDefault();
    if(currentState === "Sign Up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currentState === "Sign Up" ? 'signup': 'login',{fullName,email,password,bio});
  }


  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8
    sm:justify-evenly max-sm:flex- backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      <form
        action=""
        onSubmit={OnSubmitHandler}
        className="w-[min(90vw,400px)] border-2 bg-white/10 text-white border-gray-500 
  p-8 flex flex-col gap-6 rounded-2xl shadow-xl"
      >
        <h2 className="font-medium text-3xl flex justify-between items-center">
          {currentState}{
            isDataSubmitted && (
              <img src={assets.arrow_icon} alt="" className="w-6 cursor-pointer" 
              onClick={()=>setIsDataSubmitted(false)}
              />
            )
          }
        </h2>

        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter the Password"
              required
              className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            name=""
            id=""
            rows={4}
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter a short bio..."
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 text-lg font-medium bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        {currentState === "Sign Up" && (
          <div className="flex items-center gap-2 text-base text-gray-300">
            <input type="checkbox" required />
            <p>
              Agree to the{" "}
              <span className="text-indigo-400 cursor-pointer">Terms of Use</span> &{" "}
              <span className="text-indigo-400 cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-base text-gray-300">
              Already have an account?{" "}
              <span className="font-medium text-violet-400 cursor-pointer" onClick={()=>{setCurrentState("Login");setIsDataSubmitted(false)}}>Login Here</span>
            </p>
          ) : (
            <p className="text-base text-gray-300">
              Create an account{" "}
              <span 
              onClick={()=>setCurrentState("Sign Up")}
              className="font-medium text-violet-400 cursor-pointer">Click Here</span>
            </p>
          )}
        </div>



      </form>

    </div>
  )
}

export default LoginPage
