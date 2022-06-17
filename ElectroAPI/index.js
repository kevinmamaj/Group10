const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const prodRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors");
dotenv.config();


//Connection with  database
mongoose.connect((process.env.MONGO))
.then(()=> console.log("DbConnection successfull!"))
.catch((err) => {
    console.log(err);
});

//Api Routes
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);


//Listening to the connection port
app.listen(process.env.PORT , ()=> {
    console.log("Running");
});