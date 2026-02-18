const pool = require("../database")

/* *****************************
 * Add item to wishlist (no duplicates)
 * *************************** */
async function addToWishlist(account_id, inv_id) {
  try {
    // Check if item already exists
    const checkSql = `
      SELECT * FROM public.wishlist
      WHERE account_id = $1 AND inv_id = $2
    `
    const checkResult = await pool.query(checkSql, [account_id, inv_id])
    if (checkResult.rows.length > 0) return null // already exists

    // Insert if not exists
    const insertSql = `
      INSERT INTO public.wishlist (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `
    const insertResult = await pool.query(insertSql, [account_id, inv_id])
    return insertResult.rows[0]
  } catch (error) {
    console.error("addToWishlist error: " + error)
    return null
  }
}

/* *****************************
 * Get wishlist by account
 * *************************** */
async function getWishlistByAccount(account_id) {
  try {
    const sql = `
      SELECT w.wishlist_id, w.date_added,
             i.inv_id, i.inv_make, i.inv_model, 
             i.inv_price, i.inv_thumbnail
      FROM public.wishlist w
      JOIN public.inventory i
        ON w.inv_id = i.inv_id
      WHERE w.account_id = $1
      ORDER BY w.date_added DESC;
    `
    return await pool.query(sql, [account_id])
  } catch (error) {
    console.error("getWishlistByAccount error: " + error)
    throw error
  }
}

/* *****************************
 * Remove item from wishlist
 * *************************** */
async function removeFromWishlist(wishlist_id, account_id) {
  try {
    const sql = `
      DELETE FROM public.wishlist
      WHERE wishlist_id = $1
      AND account_id = $2
      RETURNING *;
    `
    return await pool.query(sql, [wishlist_id, account_id])
  } catch (error) {
    console.error("removeFromWishlist error: " + error)
    throw error
  }
}

module.exports = {
  addToWishlist,
  getWishlistByAccount,
  removeFromWishlist
}
