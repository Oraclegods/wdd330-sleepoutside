import { loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Wait for header/footer to load first, THEN load products
async function initializeApp() {
  try {
    console.log('Loading header and footer...');
    await loadHeaderFooter();
    console.log('Header and footer loaded successfully');
    
    // Now load products after header/footer are in place
    console.log('Loading products...');
    const dataSource = new ProductData('tents');
    const listElement = document.querySelector('.product-list');
    
    if (!listElement) {
      console.error('Could not find .product-list element');
      return;
    }
    
    console.log('Product list element found:', listElement);
    const productList = new ProductList('tents', dataSource, listElement);
    await productList.init();
    console.log('Products loaded successfully');
    
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Start the app
initializeApp();