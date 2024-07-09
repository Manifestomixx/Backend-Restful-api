require("dotenv/config")
const express = require("express");
const app = express();
const PORT = 5119;
const cors = require("cors");
const connect = require('./config/DB');
const authRoute = require('./routes/authRoute');
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const fileUpload = require('express-fileupload');
const cloudinary = require("cloudinary").v2;


// middleware
app.use(fileUpload({useTempFiles: true }));
app.use(express.json());
app.use(cors());

// API
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/posts',postRoute);

// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// server Connection
connect()
.then(()=>{
    try {
        app.listen(PORT,()=>{
            console.log(`server is connected to http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("cannot connect to server");
    }
})
.catch(()=>{
    console.log("invalid database connection...",error);
})

// for Route
app.get('/', (req, res)=>{
    res.status(200).json({success:true, message:"server is running..."})
})
app.use((req,res)=>{
    res.status(404).json({success:false, message:"Route doesn't exist"})
})