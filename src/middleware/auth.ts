import { Console } from 'console';
import * as jwt from 'jsonwebtoken'; 


export const authorize=(req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token)
        const val=jwt.verify(token, 'APP_SECRET');
        // console.log(val)
        next();
    } catch (error) {
        res.status(401).json({ message: "No token provided" });
    }
};