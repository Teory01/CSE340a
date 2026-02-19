document.addEventListener("DOMContentLoaded", () => {
  /* **************************************
   * Add to Wishlist (AJAX)
   ************************************** */
  document.querySelectorAll('.wishlist-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const button = form.querySelector('button')
      const inv_id = form.querySelector('input[name="inv_id"]').value

      try {
        const response = await fetch('/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inv_id })
        })
        const data = await response.json()
        if (data.status === "added") {
          button.textContent = "Added ✓"
          button.disabled = true
          button.classList.remove('add-wishlist')
          button.classList.add('already-wishlist')
        }
        if (data.status === "exists") {
          button.textContent = "Already Added"
          button.disabled = true
        }
      } catch (err) {
        console.error("Wishlist error:", err)
      }
    })
  })

  /* **************************************
   * Remove from Wishlist (AJAX)
   ************************************** */
  document.querySelectorAll('.remove-wishlist-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const li = form.closest('li')
      const wishlist_id = form.querySelector('input[name="wishlist_id"]').value

      try {
        const response = await fetch('/wishlist/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishlist_id })
        })
        const data = await response.json()
        if (data.status === "removed") {
          li.remove()
        }
      } catch (err) {
        console.error("Remove wishlist error:", err)
      }
    })
  })
})
