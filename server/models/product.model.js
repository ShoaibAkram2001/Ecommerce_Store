const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
  },

  discription: {
    type: String,
    required: [true, "Please Enter Product Discription"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product  Price"],
    maxLength: [8, "Pricee can't exceed 8 digits"],
  },
  ratings: {
    type: Number,
    default: 0,
  },

  images: [
    {
      public_id: {
        type: String,
        required:true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please enter product  category"],
  },

  Stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [4, "Stock can't exceed 4 characters"],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
      
       },
    },
  ],
  // which user created this product
 user:{
  type:mongoose.Schema.ObjectId,
  ref:"User",
  required:true,

 },
  createdAt:{
    type:Date,
    default: Date.now(),
  }
});


module.exports=mongoose.model('Product',productSchema);