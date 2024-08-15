/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor/steps';

// Step Definitions

Given('I am logged in', () => {
  // Navega a la página de inicio de sesión y completa el formulario
  cy.visit('http://localhost:4200/login');
  cy.get('#email').type('testuser@example.com'); // Ingresa un correo electrónico válido
  cy.get('#password').type('password123'); // Ingresa una contraseña válida
  cy.get('button[type="submit"]').contains('Iniciar').click();
  cy.url().should('not.include', '/login'); // Verifica que el usuario ha iniciado sesión
});

Given('I am on the product details page', () => {
  // Navega a la página de detalles de un producto específico
  cy.get('.navbar-links').contains('PRODUCTOS').click();
  cy.get('.product-item').first().click();
  cy.get('.details-container').should('be.visible');
  cy.url().should('include', '/product'); // Ajusta este fragmento de URL según la estructura de tu aplicación
});

When('I click the "Add to Wishlist" button', () => {
  // Haz clic en el botón para añadir el producto a la lista de deseos
  cy.get('#addToWishlist').click();
});

Then('the product should be added to my wishlist', () => {
  // Verifica que el producto se ha añadido a la lista de deseos abriendo el modal de la wishlist
  cy.get('.nav-icon').contains('Wishlist').click();
  cy.get('.wishlist-modal').should('be.visible');
  cy.get('.wishlist-item').should('have.length.greaterThan', 0); // Verifica que la lista de deseos contiene al menos un producto
});

Then('I should see a confirmation message', () => {
  // Verifica que aparece un mensaje de confirmación después de añadir el producto a la wishlist
  cy.get('.alert').should('be.visible'); // Asegúrate de que la alerta esté visible
});

When('I navigate to my wishlist page', () => {
  // Abre el modal de la wishlist desde el navbar
  cy.get('.nav-icon').contains('Wishlist').click();
});

Then('I should see all the products I have added to my wishlist', () => {
  // Verifica que la wishlist contenga todos los productos añadidos
  cy.get('.wishlist-modal').should('be.visible');
  cy.get('.wishlist-item').should('have.length.greaterThan', 0); // Verifica que la lista de deseos contiene al menos un producto
});
 
