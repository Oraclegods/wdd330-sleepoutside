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
    // Filter out products that don't have corresponding images
    const productsWithImages = list.filter(product => {
      const imageName = product.Image.split('/').pop(); // Get just the filename
      // This is a simple check - you might need to adjust based on your actual image names
      return imageName.includes('880rr') || 
             imageName.includes('985rf') || 
             imageName.includes('985pr') || 
             imageName.includes('344yj');
    });
    
    console.log(`Showing ${productsWithImages.length} of ${list.length} products (only those with images)`);
    
    renderListWithTemplate(productCardTemplate, this.listElement, productsWithImages, 'afterbegin', true);
  }
}

function productCardTemplate(product) {
  // Simple path fixing - just remove ../ prefix
  let imagePath = product.Image ? product.Image.replace('../', '') : '';
  
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}