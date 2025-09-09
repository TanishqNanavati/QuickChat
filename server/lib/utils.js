import jwt from 'jsonwebtoken';


// to generate token to user for authentication

export const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET_KEY);
    return token;
}