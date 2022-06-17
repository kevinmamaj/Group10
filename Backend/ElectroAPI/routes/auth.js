const router = require("express").Router();
const user = require("../dtb_design/User");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

// User register
router.post("/register", async (req,res) =>{
    //Get the user register details and save it on the database
    const newUser= new user({
        username: req.body.username,
        email: req.body.email,
        password: crypto.AES.encrypt(req.body.password, process.env.PASS_PHRASE).toString(),
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        
    });

    try{
        const userDetail = await newUser.save();
        res.status(201).json(userDetail);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//User login
router.post("/login", async (req,res) =>{
    try{
    // Find the user from database    
        const findUser = await user.findOne(
            {
                username: req.body.username
                
            });
        
        if( !findUser) {
            res.status(401).json("Wrong username or password");
            return;
        }
        //Decrypt the password and see if they match
        const crypt_pass = crypto.AES.decrypt(findUser.password , process.env.PASS_PHRASE);
        const decrypt_password = crypt_pass.toString(crypto.enc.Utf8);
        
        if(req.body.password != decrypt_password) {
            res.status(401).json("Wrong username or password");
            return;
        }

        if(findUser.status == 'inactive'){
            res.status(401).json("Account is inactive");
            return;
        }
        //Assign a token to the user
        const loginToken = jwt.sign({
            id:findUser._id,
            role: findUser.role
        },process.env.JWT_KEY, {expiresIn:"1d"});
        
        //Return the json file excluding the password
        const { password,...others} = findUser._doc;
        res.status(200).json({...others,loginToken});
        
    }
    catch(err){
        res.status(500).json(err);
        //console.log(err);
    }
});




module.exports = router;