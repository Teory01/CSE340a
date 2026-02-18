-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  wishlist_id SERIAL PRIMARY KEY,
  account_id INT NOT NULL,
  inv_id INT NOT NULL,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.wishlist
ADD CONSTRAINT unique_account_inventory
UNIQUE (account_id, inv_id);


-- One-to-many relationship: account → wishlist
ALTER TABLE IF EXISTS public.wishlist
  ADD CONSTRAINT fk_account
  FOREIGN KEY (account_id)
  REFERENCES public.account (account_id) MATCH SIMPLE
  ON UPDATE CASCADE
  ON DELETE NO ACTION;

-- Inventory link
ALTER TABLE IF EXISTS public.wishlist
  ADD CONSTRAINT fk_inventory
  FOREIGN KEY (inv_id)
  REFERENCES public.inventory (inv_id) MATCH SIMPLE
  ON UPDATE CASCADE
  ON DELETE NO ACTION;