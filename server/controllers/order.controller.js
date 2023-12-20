
const Order=require('../models/order.model');
const Product=require('../models/product.model');


async function newOrder (req,res,next){

    console.log("New order request received");

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        ItemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;

    const order= await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        ItemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user,
    })

    res.status(201).json({
        success:true,
        order, 
    })
}

async function getSingleOrder(req,res,next){


const order=await Order.findById(req.params.id).populate("user","name email");

if(!order){
return res.status(404).json({
    success:false,
    message:`Order not found with this id ${req.params.id}`
})
}

return res.status(200).json({
    success:true,
    order,
})
}

async function getAllOrders(req,res,next){
    const orders = await Order.find();

    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });


}

async function myOrders(req,res,next){
    const orders=await Order.find({user:req.user});

    return res.status.json({
        success:true,
        orders,
    })



}

async function updateOrder(req,res,next){
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success:false,
        message:`Order not found with this id ${req.params.id}`
    })
    }
  
    if (order.orderStatus === "Delivered") {
        return res.status(404).json({
            success:false,
            message:`You have already delivered order`
        })
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (orderItem) => {
        await updateStock(orderItem.product, orderItem.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
   return  res.status(200).json({
      success: true,
    });


}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }

async function deleteOrder(req,res,next){

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success:false,
            message:`Order not found with this id ${req.params.id}`
        })  }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });

}
  

module.exports={
    newOrder,
    getSingleOrder,
    getAllOrders,
    myOrders,
    deleteOrder,
    updateOrder
}

