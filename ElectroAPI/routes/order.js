const router = require("express").Router();
const Order = require("../dtb_design/Order");  
const {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const crypto = require("crypto-js");

//Create an order
router.post('/',verifyToken, async (req,res)=>{
    const newOrder = new Order(req.body);
    
    try {
        const added_order = await newOrder.save();
        res.status(200).json(added_order);
        
    } catch (error) {
        res.status(500).json(error);
    }
});




//Update an order (only admin can access this)
router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    

    try{
        const updated_order = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },{new:true});
        res.status(200).json(updated_order);
    }catch(err){
        res.status(500).json(err);
    }
});

//Delete an order (only admin can access this)
router.delete("/:id",verifyTokenAndAdmin, async(req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order is deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get user orders
router.get("/find/:id" ,verifyTokenAndAuthorization, async(req,res)=>{
    try{
       // console.log(req.params.id);
        const find_order = await Order.find({userId: req.params.id});
        //console.log(find_cart);
        res.status(200).json(find_order);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get all orders (only admin can access this)
router.get("/",verifyTokenAndAdmin, async(req,res)=>{

    try {
        const all_orders = await Order.find().sort({ createdAt: -1});
        res.status(200).json(all_orders);
    } catch (error) {
        res.status(500).json(error);
    }
    
});

//Calculate the monthly income (only admin can access this)
router.get("/income", verifyTokenAndAdmin,async (req,res)=>{
    const productId = req.query.productId;
    const date = new Date();
    const last_month = new Date(date.setMonth(date.getMonth()-1));
    const previous_month = new Date(date.setMonth(last_month.getMonth()-1));

    
    
        try {
            const income = await Order.aggregate([
              {
                $match: {
                  createdAt: { $gte: previous_month },
                  
                },
              },
              { $project: { month: 
                { $month: '$createdAt' },
                 sales: '$total' } 
                },
              {
                $group: {
                  _id: '$month',
                  total: { $sum: '$sales' },
                },
              },
            ]);
        
            res.status(200).json(income);
          } catch (error) {
        res.status(500).json(error);
        
    }
});





module.exports = router;