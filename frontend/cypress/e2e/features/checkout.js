/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I am on the product details page', () => {
  cy.visit('http://localhost:4200/videojuegos'); 
});

When('I add the product to the cart', () => {
  cy.get('#addToCart').click();
});

When('I proceed to checkout', () => {
  cy.get('.close-alert').click();
  cy.get('.cart-icon-container').click();
  cy.get('.cart-modal').should('be.visible'); 
  cy.get('button').contains('FINALIZAR COMPRA').click(); 
});

Then('I should be redirected to the login page if I am not logged in', () => {
  cy.url().should('include', '/login');
});

Given("I am logged in", () => {
  cy.visit('/login');
  cy.get('#email').type('testuser@example.com');
  cy.get('#password').type('password123');
  cy.get('button[type="submit"]').click();
  // Verifica que el usuario ha iniciado sesión
  cy.url().should('not.include', '/login');
});

Given('I have products in my cart', () => {
  // Añadir productos al carrito si no están ya añadidos
  cy.visit('/products/1');
  cy.get('#addToCart-detalles').click(); // Añadir al carrito desde la página de detalles
});

When('I choose PayPal as the payment method', () => {
  // Selecciona el método de pago PayPal (asume que se muestra el botón de PayPal en la página de pago)
  cy.get('#paypal-button-container').should('be.visible'); // Verifica que el botón de PayPal esté visible
});

When('I complete the payment', () => {
  // Completa el proceso de pago (esto puede implicar una simulación o interacción manual si PayPal abre una ventana emergente)
  cy.get('#paypal-button-container').click(); // Haz clic en el botón de PayPal
  // Suponiendo que el flujo de pago se maneja automáticamente en el entorno de pruebas
});

Then('I should see a confirmation of my order', () => {
  // Verifica que se muestra una confirmación de pedido
  cy.get('.order-confirmation').should('be.visible'); // Asegúrate de que la confirmación del pedido sea visible
});

Then('the products should be removed from my cart', () => {
  // Verifica que el carrito esté vacío después de completar la compra
  cy.visit('/cart');
  cy.get('.cart-content').should('not.exist'); // Verifica que no haya productos en el carrito
});
 
