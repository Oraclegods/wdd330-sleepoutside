import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // Get product details from API
      this.product = await this.dataSource.findProductById(this.productId);
      console.log('Product details loaded:', this.product);
      
      // Render the product details
      this.renderProductDetails();
      
      // Add event listener to Add to Cart button
      const addToCartBtn = document.getElementById('addToCart');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', this.addToCart.bind(this));
      }
    } catch (error) {
      console.error('Error initializing product details:', error);
    }
  }

  addToCart() {
    let cart = getLocalStorage('so-cart') || [];
    if (!Array.isArray(cart)) {
      cart = []; // Ensure it's always an array
    }
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    console.log('Product added to cart:', this.product.Name);
  }

  renderProductDetails() {
    if (!this.product) {
      console.error('No product data to render');
      return;
    }

    console.log('Rendering product details...');

    // Update page title
    document.title = `Sleep Outside | ${this.product.NameWithoutBrand || this.product.Name}`;
    
    // Update product brand
    const productBrand = document.getElementById('product-brand');
    if (productBrand) {
      productBrand.textContent = this.product.Brand?.Name || '';
    }
    
    // Update product name
    const productName = document.getElementById('product-name');
    if (productName) {
      productName.textContent = this.product.NameWithoutBrand || this.product.Name;
    }
    
    // Update product image - Use PrimaryLarge for detail page
    const productImage = document.getElementById('product-image');
    if (productImage) {
      productImage.src = this.product.Images?.PrimaryLarge || '/images/placeholder.jpg';
      productImage.alt = this.product.Name;
    }
    
    // Update product price
    const productPrice = document.getElementById('product-price');
    if (productPrice) {
      productPrice.textContent = `$${this.product.FinalPrice}`;
    }
    
    // Update product color
    const productColor = document.getElementById('product-color');
    if (productColor) {
      productColor.textContent = this.product.Colors?.[0]?.ColorName || '';
    }
    
    // Update product description
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
      productDescription.innerHTML = this.product.DescriptionHtmlSimple || '';
    }
    
    // Update add to cart button data-id
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
      addToCartBtn.dataset.id = this.product.Id;
    }
  }
}