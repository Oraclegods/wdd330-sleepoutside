import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Get product details before rendering
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Render the product details
    this.renderProductDetails();
    
    // Add event listener to Add to Cart button
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    let cart = getLocalStorage('so-cart');
    if (!cart || !Array.isArray(cart)) {
      cart = []; // Ensure it's always an array
    }
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
  }

  renderProductDetails() {

     console.log('Starting renderProductDetails...');
     console.log('Product data:', this.product);
    // === FIX: CLEAR EXISTING CONTENT FIRST ===
    // Clear text content of all elements that will be updated
    const selectorsToClear = [
      '.breadcrumb li:last-child',
      '.product-detail__name', 
      '.product-detail__brand',
      '.product-detail__price',
      '.product-detail__description'
    ];
    
    
    selectorsToClear.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = '';
      }
    });

    // Now update with dynamic product data
    document.title = `${this.product.NameWithoutBrand} - Sleep Outside`;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb li:last-child');
    if (breadcrumb) {
      breadcrumb.textContent = this.product.NameWithoutBrand;
    }
    
    // Update product image
    const productImage = document.querySelector('.product-detail__image img');
    if (productImage) {
      productImage.src = this.product.Images.PrimaryLarge;
      productImage.alt = this.product.NameWithoutBrand;
    }
    
    // Update product name
    const productName = document.querySelector('.product-detail__name');
    if (productName) {
      productName.textContent = this.product.NameWithoutBrand;
    }
    
    // Update product brand
    const productBrand = document.querySelector('.product-detail__brand');
    if (productBrand) {
      productBrand.textContent = this.product.Brand.Name;
    }
    
    // Update product price
    const productPrice = document.querySelector('.product-detail__price');
    if (productPrice) {
      productPrice.textContent = `$${this.product.FinalPrice}`;
    }
    
    // Update product description
    const productDescription = document.querySelector('.product-detail__description');
    if (productDescription) {
      productDescription.innerHTML = this.product.DescriptionHtmlSimple;
    }
  }
}