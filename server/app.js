
const express=require('express');
const cookieParser=require('cookie-parser');
const { productRouter } = require('./routes/product.route');
const {userRouter}=require('./routes/user.route');
const {orderRouter} = require('./routes/order.route');
const morgan = require('morgan');


const app=express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

//Routes

app.use('/api/v1',productRouter);
app.use('/api/v1',userRouter);
app.use('/api/v1',orderRouter);


module.exports=app;