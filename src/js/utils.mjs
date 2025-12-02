// 1. IMPORT TEMPLATES AT THE TOP (This fixes the Netlify 404 error)
import headerTemplate from "../partials/header.html?raw";
import footerTemplate from "../partials/footer.html?raw";

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Copy and modify renderListWithTemplate
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// loadTemplate function (Kept for other uses, but not used for Header/Footer anymore)
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// 2. FIXED loadHeaderFooter FUNCTION
export async function loadHeaderFooter() {
  // We no longer 'fetch' the files. We use the imported variables from the top.
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Get URL parameter
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function alertMessage(message, scroll = true) {
  // Remove any existing alerts
  const existingAlert = document.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert element
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `
    <span>${message}</span>
    <button class="alert-close">&times;</button>
  `;

  // Add close functionality
  alert.querySelector(".alert-close").addEventListener("click", function () {
    alert.remove();
  });

  // Add to top of main
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  // Scroll to top if requested
  if (scroll) {
    window.scrollTo(0, 0);
  }

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}