const router = require("express").Router();
const Cart = require("../dtb_design/Cart");
const {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const crypto = require("crypto-js");

//Add a product to the cart
router.post('/',verifyToken, async (req,res)=>{
    const newCart = new Cart(req.body);
    //console.log(req.body);
    try {
        const added_product = await newCart.save();
        res.status(200).json(added_product);
    } catch (error) {
        res.status(500).json(error);
    }
});


/*router.get('/:id',verifyToken, async (req,res)=>{
    const newCart = await Cart.findById()
    console.log(req.body);
    try {
        const added_product = await newCart.save();
        res.status(200).json(added_product);
    } catch (error) {
        res.status(500).json(error);
    }
})*/

//Update the cart items
router.put('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    

    try{
        const updated_cart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },{new:true});
        res.status(200).json(updated_cart);
    }catch(err){
        res.status(500).json(err);
    }
});

//Delete an item from the cart
router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart is deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get a specific user cart
router.get("/find/:id" ,verifyTokenAndAuthorization, async(req,res)=>{
    try{
       // console.log(req.params.id);
        const find_cart = await Cart.findOne({userId: req.params.id});
        //console.log(find_cart);
        res.status(200).json(find_cart);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get all users carts (only admi can access this)
router.get("/",verifyTokenAndAdmin, async(req,res)=>{

    try {
        const all_carts = await Cart.find().sort({ createdAt: -1});
        res.status(200).json(all_carts);
    } catch (error) {
        res.status(500).json(error);
    }
    
});





module.exports = router;