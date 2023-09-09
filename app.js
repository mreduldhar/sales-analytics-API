const express = require('express')
const router = require('./src/routes/api')

app = express();

// Database Library Import
const mongoose = require('mongoose');


// Security Middleware Lib import
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp"); 
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");


// Middlewares implement
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(hpp());

// Request Rate Limit
const limiter = rateLimit({	windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);


// Database COnnection
let URL = "mongodb+srv://<username>:<password>@cluster0.m8adn0j.mongodb.net/RestfullAPI"
let option = {user: 'mredul', pass : 'mredul123'}

mongoose.connect(URL,option).then((res)=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Database not connected");
})

// routing implement
app.use("/api/v1", router)

// undefined routing

app.use("*", (req, res)=>{
    res.status(404).json({status:'fail', data: "Not Found"})
})

module.exports = app ;