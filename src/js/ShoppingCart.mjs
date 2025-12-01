import { renderListWithTemplate } from './utils.mjs';

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartItems = null; // Store cart items for use in totals calculation
  }

  renderCartItems(cartItems) {
    console.log('Rendering cart items:', cartItems);
    this.cartItems = cartItems; // Store for use in renderCartTotals
    
    if (!cartItems || cartItems.length === 0) {
      this.listElement.innerHTML = '<li>Your cart is empty</li>';
      return;
    }
    
    // Clear existing content
    this.listElement.innerHTML = '';
    
    // Render cart items
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, 'afterbegin', true);
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.FinalPrice * (item.Quantity || 1));
    }, 0);
    
    // Add totals section
    this.renderCartTotals(subtotal);
  }

  renderCartTotals(subtotal) {
    // Make sure cartItems is available
    if (!this.cartItems) {
      console.error('Cart items not available for totals calculation');
      return;
    }
    
    const shipping = 10 + (Math.max(0, this.cartItems.length - 1) * 2);
    const tax = subtotal * 0.06;
    const total = subtotal + tax + shipping;
    
    const totalsHTML = `
      <div class="cart-totals">
        <h3>Order Summary</h3>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax: $${tax.toFixed(2)}</p>
        <p>Shipping: $${shipping.toFixed(2)}</p>
        <p class="total">Total: $${total.toFixed(2)}</p>
        <a href="/checkout/index.html" class="checkout-btn">Proceed to Checkout</a>
      </div>
    `;
    
    this.listElement.insertAdjacentHTML('beforeend', totalsHTML);
  }
}

function cartItemTemplate(item) {
  // Use new API image structure with fallback
  const imagePath = item.Images?.PrimaryMedium || item.Image || '/images/placeholder.jpg';
  
  return `
    <li class="cart-card divider">
      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${imagePath}" alt="${item.Name}" />
      </a>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ''}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${(item.FinalPrice * (item.Quantity || 1)).toFixed(2)}</p>
    </li>
  `;
}