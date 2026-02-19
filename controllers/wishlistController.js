const wishlistModel = require("../models/wishlist-model")
const utilities = require("../utilities/")
const wishlistController = {}

/* *****************************
 * Add to wishlist (AJAX friendly)
 * *************************** */
wishlistController.addToWishlist = async function(req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    const result = await wishlistModel.addToWishlist(account_id, inv_id)

    // If already exists
    if (!result) {
      return res.status(200).json({ status: "exists" })
    }

    // Successfully added
    return res.status(200).json({ status: "added" })

  } catch (error) {
    console.error("Add to wishlist error:", error)
    return res.status(500).json({ status: "error" })
  }
}

/* *****************************
 * View Wishlist
 * *************************** */
wishlistController.buildWishlist = async function(req, res) {
  const account_id = res.locals.accountData.account_id
  const data = await wishlistModel.getWishlistByAccount(account_id)
  const nav = await utilities.getNav()

  res.render("wishlist/index", {
    title: "My Wishlist",
    nav,
    wishlist: data.rows
  })
}

/* *****************************
 * Remove item (AJAX friendly)
 * *************************** */
wishlistController.removeItem = async function(req, res) {
  const { wishlist_id } = req.body
  const account_id = res.locals.accountData.account_id

  await wishlistModel.removeFromWishlist(wishlist_id, account_id)

  return res.status(200).json({ status: "removed" })
}


module.exports = wishlistController
