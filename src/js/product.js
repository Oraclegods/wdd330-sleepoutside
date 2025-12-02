import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();

const productId = getParam('product');
const dataSource = new ExternalServices();
const product = new ProductDetails(productId, dataSource);
product.init();

function addProductToCart(product) {
  const currentCart = JSON.parse(localStorage.getItem("so-cart")) || [];
  currentCart.push(product);
  localStorage.setItem("so-cart", JSON.stringify(currentCart));
}

async function addToCartHandler(e) {
  try {
    // Get the product ID from the button's dataset
    const productId = e.target.dataset.id;
    
    // Make sure we have a product ID
    if (!productId) {
      console.error('No product ID found on button');
      return;
    }
    
    // Fetch the product details
    const product = await dataSource.findProductById(productId);
    
    // Add the product to cart
    addProductToCart(product);
    
    // Show success message
    alertMessage(`${product.Name} added to cart!`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    alertMessage('Failed to add product to cart. Please try again.');
  }
}

// Get the add to cart button
const addToCartBtn = document.getElementById("addToCart");

// Check if button exists before adding event listener
if (addToCartBtn) {
  // Remove any existing event listeners to prevent duplicates
  addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
  
  // Get the fresh button reference
  const freshBtn = document.getElementById("addToCart");
  
  // Add the event listener
  freshBtn.addEventListener("click", addToCartHandler);
} else {
  console.warn('Add to cart button not found');
}