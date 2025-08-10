const jwt= require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        let token = req.header("x-token");
        
        if(!token){
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; 
        next(); 
    }catch(error){
        console.error("Error in middleware:", error);
        return res.status(400).send("Authentication failed");
    }
}