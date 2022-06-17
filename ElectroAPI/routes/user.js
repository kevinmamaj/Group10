const router = require("express").Router();
const User = require("../dtb_design/User");
const {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const crypto = require("crypto-js");

//Update the user details
router.put('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    if(req.body.password){
        //console.log(req.body.password);
        req.body.password = crypto.AES.encrypt(req.body.password, process.env.PASS_PHRASE).toString();
        //console.log(req.body.password);
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});

//delete a user
router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
        await User.findByIdAndUpdate(req.params.id,{status: "inactive"});
        res.status(200).json("User is inactive");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get a user details (only admin can access this)
router.get("/find/:id",verifyTokenAndAdmin , async(req,res)=>{
    try{
       
        const findUser = await User.findById(req.params.id);
        const { password,...others} = findUser._doc;
        res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get all user details (only admin can access this)
router.get("/",verifyTokenAndAdmin, async(req,res)=>{
    try{
       
       
        const findUser = await User.find();
        
        res.status(200).json(findUser);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get user stats (only admin can access this)
router.get("/stats",verifyTokenAndAdmin , async(req,res)=>{
    const current_date = new Date();
    const last_year = new Date(current_date.setFullYear(current_date.getFullYear()-1));

    try {
        const data = await User.aggregate([
            {
                $match: {createdAt:{$gte: last_year}}
            },{
                $project:{ 
                    month:{$month: "$createdAt"},},
            },{
                $group:{
                    _id: "$month",
                    total:{$sum: 1},
                }
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }

});



module.exports = router;