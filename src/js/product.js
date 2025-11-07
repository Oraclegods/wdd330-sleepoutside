//import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const currentCart = JSON.parse(localStorage.getItem("so-cart")) || [];
  // setLocalStorage("so-cart", product);
   // add the new product
  currentCart.push(product);

   // save updated cart back to localStorage
  localStorage.setItem("so-cart", JSON.stringify(currentCart));
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
