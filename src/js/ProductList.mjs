import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, 'afterbegin', true);
  }
}

function productCardTemplate(product) {
  // Comprehensive image path fixing
  let imagePath = product.Image || '';
  
  console.log(`Original image path for ${product.Name}:`, imagePath);
  
  // Fix all possible path issues
  if (imagePath) {
    // Remove any ../ prefixes
    imagePath = imagePath.replace(/\.\.\//g, '');
    
    // Ensure it starts with /images/
    if (!imagePath.startsWith('/images/')) {
      if (imagePath.startsWith('images/')) {
        imagePath = '/' + imagePath;
      } else {
        imagePath = '/images/' + imagePath;
      }
    }
  } else {
    // Fallback if no image path
    imagePath = '/images/placeholder.jpg';
  }
  
  console.log(`Fixed image path for ${product.Name}:`, imagePath);
  
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}" 
           onerror="this.style.display='none'; console.log('Failed to load image: ${imagePath}')">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}