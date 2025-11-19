import { getLocalStorage } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartListElement = document.querySelector(".product-list");
  
  if (cartItems.length === 0) {
    cartListElement.innerHTML = '<li>Your cart is empty</li>';
    return;
  }

  const shoppingCart = new ShoppingCart(cartListElement);
  shoppingCart.renderCartItems(cartItems);
}

renderCartContents();