
const express=require('express');
const cookieParser=require('cookie-parser');
const { productRouter } = require('./routes/product.route');
const {userRouter}=require('./routes/user.route');

const app=express();

app.use(express.json());
app.use(cookieParser());

//Routes

app.use('/api/v1',productRouter);
app.use('/api/v1',userRouter);


module.exports=app;