const express = require("express")
const router = new express.Router()
const wishlistController = require("../controllers/wishlistController")
const utilities = require("../utilities/")

// View wishlist
router.get(
  "/",
  utilities.checkLogin,
  wishlistController.buildWishlist
)

// Add item
router.post(
  "/add",
  utilities.checkLogin,
  wishlistController.addToWishlist
)

// Remove item
router.post(
  "/remove",
  utilities.checkLogin,
  wishlistController.removeItem
)

module.exports = router
