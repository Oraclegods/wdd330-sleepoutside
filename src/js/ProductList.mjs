import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    console.log('ProductList constructor - listElement:', listElement);
  }

  async init() {
    try {
      console.log('ProductList.init() started');
      // FIX: Pass category to getData() for API call
      const list = await this.dataSource.getData(this.category);
      console.log('Data received:', list.length, 'products');
      this.renderList(list);
    } catch (error) {
      console.error('Error in ProductList.init():', error);
    }
  }

  renderList(list) {
    console.log('renderList called with', list.length, 'products');
    console.log('List element:', this.listElement);
    
    if (list.length === 0) {
      console.warn('No products found!');
      this.listElement.innerHTML = '<li>No products available</li>';
      return;
    }
    
    renderListWithTemplate(productCardTemplate, this.listElement, list, 'afterbegin', true);
    console.log('Products rendered successfully');
  }
}

function productCardTemplate(product) {
  console.log('Creating template for:', product.Name);
  // Use PrimaryMedium image from API, fallback to placeholder
  const imagePath = product.Images?.PrimaryMedium || '/images/placeholder.jpg';
  
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand?.Name || ''}</h2>
      <h3 class="card__name">${product.NameWithoutBrand || product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}