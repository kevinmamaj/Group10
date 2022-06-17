const jwt = require("jsonwebtoken");


const verifyToken = async (req,res,next)=>{
    //Get the token from the header
    const authHeader = req.headers.token;
    
    // Split the token from Bearer
    if(authHeader){
        const token = authHeader.split(" ")[1];
        
        //Verify the token by decrypting it and see if the token is valid
        jwt.verify(token, process.env.JWT_KEY,(err,user)=>{
            if(err) 
            res.status(403).json("Token is not valid");
            req.user = user;
            
            // Go to the next function
            next();
        });
    }else{
        return res.status(401).json("Not authorized");
    }
};

//Verify if the token belongs to the right user and check the role of the user
const verifyTokenAndAuthorization = (req,res,next) =>{
    
    verifyToken(req,res,()=>{
        
        if(req.user.id === req.params.id || req.user.role ){
            //console.log(req.user.id);
            next();
        }else{
            //console.log(req.user.id)
            res.status(403).json("Not allowedddd");
        }
    });
};

//Check if the user is an admin
const verifyTokenAndAdmin = (req,res,next) =>{
    
    verifyToken(req,res,()=>{
        
        if(req.user.role == 1){
            
            next();
        }else{
            //console.log(req.user.id)
            res.status(403).json("Not allowed");
        }
    });
};

//Export the modules
module.exports = {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin};