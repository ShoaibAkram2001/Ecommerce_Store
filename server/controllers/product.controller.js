const productModel = require("../models/product.model");
const ObjectID = require("mongodb").ObjectId;

const apiFeatures = require("../utils/apiFeatures");

//getAllProducts

const getAllProducts = async (req, res) => {
 // console.log(req.query);
 const ResultPerPage=3;
  const apiFeature = new apiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(ResultPerPage);

  const products = await apiFeature?.query;
    console.log(products);
  res.status(200).json({
    success: "ok",
    products,
  });
};

//createProduct

const createProduct = async (req, res) => {
  //console.log("Post route working");
  console.log(req.body);
  req.body.user =req.user?.id;
  console.log(req.body);

  try {
    const newProduct = await productModel.create(req.body);

    res.status(201).json({
      success: "ok",
      newProduct,
    });
  } catch (error) {
    console.log("Error is :", error);
  }
};

//update_Product

const updateProduct = async (req, res) => {
  try {
    console.log("Product id is :", req.params.id);
    console.log("Updated data is :", req.body);

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        // runValidators:true,
        // useFindAndModify:false
      }
    );

    res.status(200).json({
      success: "ok",
      updateProduct,
    });
  } catch (error) {
    console.log("Error is :", error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    // Convert the _id value to an ObjectID
    const objectIdToDelete = new ObjectID(req.params.id);

    // Create the filter to match the document by _id
    const filter = { _id: objectIdToDelete };

    const result = await productModel.deleteOne(filter);

    console.log(filter, result);

    if (result.deletedCount === 1) {
      res.status(200).json({
        message: "Document removed successfully",
      });
      console.log("Document removed successfully");
    } else {
      console.log("Document not found");
    }
  } catch (err) {
    console.error("Error removing document:", err);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
