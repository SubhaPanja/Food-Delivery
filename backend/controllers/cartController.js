import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.itemId) {
      return res.json({ success: false, message: "User ID and Item ID are required" });
    }

    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.json({ success: false, message: "An error occurred while adding to cart" });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.itemId) {
      return res.json({ success: false, message: "User ID and Item ID are required" });
    }

    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    if (cartData[req.body.itemId] > 1) {
      cartData[req.body.itemId] -= 1;
    } else {
      delete cartData[req.body.itemId];
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.json({ success: false, message: "An error occurred while removing from cart" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.json({ success: false, message: "An error occurred while fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart };