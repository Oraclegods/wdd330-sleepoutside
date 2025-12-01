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
      throw error;
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
    
    // Convert form data to JSON
    const formData = this.formDataToJSON(form);
    
    // Validate form
    if (!this.validateForm(formData)) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    
    try {
      const response = await this.checkout(formData);
      alert('Order submitted successfully!');
      
      // Clear cart on success
      localStorage.removeItem('so-cart');
      
      // You can redirect to a confirmation page here
      // window.location.href = '/order-confirmation.html';
      
      console.log('Order response:', response);
      return response;
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Error submitting order: ${error.message}. Please try again.`);
    }
  }

  validateForm(formData) {
    // Check all required fields are filled
    const requiredFields = ['fname', 'lname', 'street', 'city', 'state', 'zip', 'cardNumber', 'expiration', 'code'];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    // Validate zip code (5 digits)
    if (!/^\d{5}$/.test(formData.zip)) {
      console.error('Invalid zip code');
      return false;
    }
    
    // Validate card number (16 digits)
    if (!/^\d{16}$/.test(formData.cardNumber)) {
      console.error('Invalid card number');
      return false;
    }
    
    // Validate expiration (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(formData.expiration)) {
      console.error('Invalid expiration date');
      return false;
    }
    
    // Validate security code (3 digits)
    if (!/^\d{3}$/.test(formData.code)) {
      console.error('Invalid security code');
      return false;
    }
    
    return true;
  }
}