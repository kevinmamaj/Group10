const router = require("express").Router();
const Product = require("../dtb_design/Product");
const {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const crypto = require("crypto-js");

//Create a new product (only admin can access this)
router.post('/',verifyTokenAndAdmin, async (req,res)=>{
    const newProduct = new Product(req.body);

    try {
        const added_product = await newProduct.save();
        res.status(200).json(added_product);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Update a product (only admin can access this)
router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    

    try{
        const updated_product = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },{new:true});
        res.status(200).json(updated_product);
    }catch(err){
        res.status(500).json(err);
    }
});

//Delete a product (make it inactive)
router.delete("/:id",verifyTokenAndAdmin, async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id,{status: "inactive"});
        res.status(200).json("Product is deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get a specific product by id
router.get("/find/:id" , async(req,res)=>{
    try{
        
        const find_product = await Product.findById(req.params.id);
        res.status(200).json(find_product);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get all products with queries
router.get("/", async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(5);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  });





module.exports = router;