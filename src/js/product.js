import { getParam, loadHeaderFooter } from './utils.mjs';
// import ProductData from './ProductData.mjs';
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
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

document.getElementById("addToCart")?.addEventListener("click", addToCartHandler);