import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/", // <--- THIS prevents the "Flash & 404" issue!
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        // Double check: Do you have a folder named 'product_pages'? 
        // If not, delete this line or change it to 'product' if that is the folder name.
        product: resolve(__dirname, "src/product_pages/index.html"),
        listing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
});