/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor/steps';

// Step Definitions

Given('I visit the homepage', () => {
  // Navega a la página principal de la aplicación
  cy.visit('http://localhost:4200/');
});

When('I navigate to the products section', () => {
  // Usa el navbar para navegar a la sección de productos
  cy.get('.navbar-links').contains('PRODUCTOS').click();
  // Asegúrate de que la sección de productos esté visible
  cy.get('#products-container').should('be.visible');
});

Then('I should see a list of all available products', () => {
  // Verifica que la lista de productos esté visible y tenga productos
  cy.get('.product-item').should('have.length.greaterThan', 0);
});

Then('each product should have a title, image, and price', () => {
  // Verifica que cada producto tenga un título, imagen y precio
  cy.get('.product-item').each(($product) => {
    cy.wrap($product).find('.product-name').should('not.be.empty');
    cy.wrap($product).find('.img-product').should('have.attr', 'src').and('not.be.empty');
    cy.wrap($product).find('.price-product').should('not.be.empty');
  });
});

Given('I am on the products page', () => {
  // Navega directamente a la página de productos si es necesario
  cy.visit('/products'); // Ajusta esta URL según tu aplicación si es diferente
});

When('I click on a product', () => {
  // Haz clic en el primer producto de la lista para ver los detalles
  cy.get('.product-item').first().click();
});

Then('I should be redirected to the product details page', () => {
  // Verifica que la URL cambie a la página de detalles del producto
  cy.url().should('include', '/product'); // Ajusta este fragmento de URL según la estructura de tu aplicación
  cy.get('.details-container').should('be.visible');
});

Then('I should see detailed information about the product', () => {
  // Verifica que la información detallada del producto esté visible
  cy.get('#img-detalles').should('have.attr', 'src').and('not.be.empty');
  cy.get('#nombre-text').should('not.be.empty');
  cy.get('#precio-text').should('not.be.empty');
  cy.get('#detalles-text').should('not.be.empty');
  cy.get('#desc-text').should('not.be.empty');
});

Then('I should see an option to add the product to the wishlist or cart', () => {
  // Verifica que los botones para añadir a la wishlist y al carrito estén presentes
  cy.get('#addToWishlist').should('be.visible');
  cy.get('#addToCart-detalles').should('be.visible');
});
