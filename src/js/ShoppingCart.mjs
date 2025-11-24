import { renderListWithTemplate } from './utils.mjs';

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
  }

  renderCartItems(cartItems) {
    console.log('Rendering cart items:', cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      this.listElement.innerHTML = '<li>Your cart is empty</li>';
      return;
    }
    
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, 'afterbegin', true);
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
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}