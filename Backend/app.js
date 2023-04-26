const express=require("express");
const app=express();
var bodyParser=require("body-parser");
const errorMiddleware =require("./middleware/error")
const product=require("./routes/productRoute");
const user=require("./routes/userRoute");
const cookieParser =require("cookie-parser");
const order=require("./routes/orderRoute");
const cors=require("cors");
const fileUpload=require("express-fileupload");
const payment=require("./routes/paymentRoute");
const dotenv=require("dotenv");
const path=require("path");

//Config
dotenv.config({path:"backend/config/config.env"});



// app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// app.use(fileUpload());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb',parameterLimit:100000000, extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//Route imports

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);
//Middlewares for errors
app.use(errorMiddleware);


app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports=app;