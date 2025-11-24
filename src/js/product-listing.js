import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const titleElement = document.querySelector('#page-title');

// Update page title with category
/* if (category && titleElement) {
  titleElement.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
} */

if (category && titleElement) {
  const formattedCategory = category.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

const productList = new ProductList(category, dataSource, listElement);
productList.init();