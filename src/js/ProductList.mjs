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
      const list = await this.dataSource.getData();
      console.log('Data received:', list.length, 'products');
      this.renderList(list);
    } catch (error) {
      console.error('Error in ProductList.init():', error);
    }
  }

  renderList(list) {
    console.log('renderList called with', list.length, 'products');
    console.log('List element:', this.listElement);
    
    // Filter out products that don't have corresponding images
    const productsWithImages = list.filter(product => {
      const imageName = product.Image.split('/').pop();
      return imageName.includes('880rr') || 
             imageName.includes('985rf') || 
             imageName.includes('985pr') || 
             imageName.includes('344yj');
    });
    
    console.log(`Showing ${productsWithImages.length} of ${list.length} products`);
    
    if (productsWithImages.length === 0) {
      console.warn('No products with images found!');
      this.listElement.innerHTML = '<li>No products available</li>';
      return;
    }
    
    renderListWithTemplate(productCardTemplate, this.listElement, productsWithImages, 'afterbegin', true);
    console.log('Products rendered successfully');
  }
}

function productCardTemplate(product) {
  console.log('Creating template for:', product.Name);
  let imagePath = product.Image ? product.Image.replace('../', '') : '';
  
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="/${imagePath}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}