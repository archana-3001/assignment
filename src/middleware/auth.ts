import * as jwt from 'jsonwebtoken'; 


module.exports=(req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'APP_SECRET');
        next();
    } catch (error) {
        res.status(401).json({ message: "No token provided" });
    }
};