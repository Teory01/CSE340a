const wishlistModel = require("../models/wishlist-model")
const utilities = require("../utilities/")
const wishlistController = {}

/* *****************************
 * Add to wishlist
 * *************************** */
async function addToWishlist(req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    await wishlistModel.addToWishlist(account_id, inv_id)
    req.flash("notice", "Item added to wishlist.")
    res.redirect("/wishlist")
  } catch (error) {
    req.flash("notice", "Item already in wishlist or error occurred.")
    res.redirect("back")
  }
}

/* *****************************
 * View Wishlist
 * *************************** */
async function buildWishlist(req, res) {
  const account_id = res.locals.accountData.account_id
  const data = await wishlistModel.getWishlistByAccount(account_id)

  res.render("index", {
  title: "Home",
  nav,
  wishlist: data.rows
})

}

/* *****************************
 * Remove item
 * *************************** */
async function removeItem(req, res) {
  const { wishlist_id } = req.body
  const account_id = res.locals.accountData.account_id

  await wishlistModel.removeFromWishlist(wishlist_id, account_id)
  req.flash("notice", "Item removed from wishlist.")
  res.redirect("/wishlist")
}

module.exports = {
  addToWishlist,
  buildWishlist,
  removeItem,
}
