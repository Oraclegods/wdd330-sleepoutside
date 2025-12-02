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
      
      // Set up cart listener (only once)
      this.setupCartListener();
      
    } catch (error) {
      console.error('Error initializing product details:', error);
    }
  }

  setupCartListener() {
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
      // Remove any existing listeners to prevent duplicates
      const newBtn = addToCartBtn.cloneNode(true);
      addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
      
      // Add fresh event listener
      document.getElementById('addToCart').addEventListener('click', (e) => {
        e.preventDefault();
        this.addToCart();
      });
    }
  }

  addToCart() {
    let cart = getLocalStorage('so-cart') || [];
    
    // Check if this product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.Id === this.product.Id);
    
    if (existingItemIndex !== -1) {
      // Product exists - increment quantity
      cart[existingItemIndex].Quantity = (cart[existingItemIndex].Quantity || 1) + 1;
      console.log(`Updated quantity for ${this.product.Name}: ${cart[existingItemIndex].Quantity}`);
    } else {
      // New product - add with quantity 1
      const productToAdd = { ...this.product };
      productToAdd.Quantity = 1;
      cart.push(productToAdd);
      console.log(`Added new product: ${this.product.Name}`);
    }
    
    setLocalStorage('so-cart', cart);
    
    // Show feedback to user
    this.showCartFeedback();
  }

  showCartFeedback() {
    // Create or update cart feedback element
    let feedback = document.querySelector('.cart-feedback');
    
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'cart-feedback';
      feedback.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
      `;
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(feedback);
    }
    
    // Update message
    feedback.textContent = `✅ ${this.product.Name} added to cart!`;
    feedback.style.background = '#4CAF50'; // Green for success
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (feedback && feedback.parentNode) {
        feedback.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
          if (feedback && feedback.parentNode) {
            feedback.remove();
          }
        }, 500);
      }
    }, 3000);
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