import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor() {
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
    this.cartItems = getLocalStorage('so-cart') || [];
    this.externalServices = new ExternalServices();
  }

  init() {
    this.calculateSubtotal();
    this.displayOrderSummary();
    this.setupFormValidation();
  }

  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.FinalPrice * (item.Quantity || 1));
    }, 0);
    return this.subtotal;
  }

  calculateTaxAndShipping(zip = '') {
    // Tax: 6% of subtotal
    this.tax = this.subtotal * 0.06;
    
    // Shipping: $10 first item + $2 each additional
    this.shipping = 10 + (Math.max(0, this.cartItems.length - 1) * 2);
    
    this.orderTotal = this.subtotal + this.tax + this.shipping;
    
    return {
      tax: this.tax,
      shipping: this.shipping,
      orderTotal: this.orderTotal
    };
  }

  displayOrderSummary() {
    const summaryElement = document.getElementById('orderSummary');
    if (!summaryElement) return;

    const { tax, shipping, orderTotal } = this.calculateTaxAndShipping();
    
    summaryElement.innerHTML = `
      <div class="summary-item">
        <span>Subtotal (${this.cartItems.length} items)</span>
        <span>$${this.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span>Tax (6%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span>Shipping</span>
        <span>$${shipping.toFixed(2)}</span>
      </div>
      <div class="summary-total">
        <span>Order Total</span>
        <span>$${orderTotal.toFixed(2)}</span>
      </div>
    `;
  }

  packageItems() {
    return this.cartItems.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.Quantity || 1
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    
    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });
    
    return convertedJSON;
  }

  async checkout(formData) {
    const items = this.packageItems();
    const { tax, shipping, orderTotal } = this.calculateTaxAndShipping();
    
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: items,
      orderTotal: orderTotal.toFixed(2),
      shipping: shipping,
      tax: tax.toFixed(2)
    };

    console.log('Submitting order:', order);
    
    try {
      const response = await this.externalServices.checkout(order);
      console.log('Server response:', response);
      return response;
    } catch (error) {
      console.error('Checkout failed:', error);
      
      // Handle different types of errors
      if (error.name === 'servicesError') {
        // Server returned an error with details
        throw new Error(`Server Error: ${JSON.stringify(error.message)}`);
      } else {
        // Network or other error
        throw new Error(`Checkout failed: ${error.message}`);
      }
    }
  }

  setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    const zipInput = document.getElementById('zip');
    
    if (zipInput) {
      zipInput.addEventListener('blur', () => {
        this.displayOrderSummary();
      });
    }
    
    if (form) {
      form.addEventListener('submit', (e) => {
        this.handleFormSubmit(e);
      });
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    // Check form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return; // Stop if form is invalid
    }
    
    // Convert form data to JSON
    const formData = this.formDataToJSON(form);
    
    try {
      const response = await this.checkout(formData);
      
      // SUCCESS: Clear cart and redirect
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Show error message to user
      this.showErrorMessage(error.message);
    }
  }

  showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>❌ ${message}</p>
      <button class="close-error">×</button>
    `;
    
    // Add close functionality
    errorDiv.querySelector('.close-error').addEventListener('click', () => {
      errorDiv.remove();
    });
    
    // Insert at top of form
    const form = document.getElementById('checkoutForm');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Scroll to top to show error
    window.scrollTo(0, 0);
  }

  // NOTE: Removed the old validateForm method since we're now using HTML5 validation
  // via form.checkValidity() and form.reportValidity()
}