/*import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const dataSource = new ProductData('tents');
const listElement = document.querySelector('.product-list');
const productList = new ProductList('tents', dataSource, listElement);

productList.init();*/


import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

console.log('=== DEBUG: main.js started ===');

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const listElement = document.querySelector('.product-list');

  if (!listElement) {
    console.warn('No .product-list container found. Skipping ProductList initialization.');
    return; // Exit early if container doesn't exist
  }

  // Initialize data source
  const dataSource = new ProductData('tents');
  console.log('DataSource created:', dataSource);

  // Initialize product list
  const productList = new ProductList('tents', dataSource, listElement);
  console.log('ProductList instance created:', productList);

  // Initialize and handle async completion
  productList.init()
    .then(() => {
      console.log('=== DEBUG: ProductList.init() completed ===');
    })
    .catch((err) => {
      console.error('Error initializing ProductList:', err);
    });
});
