/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';


Given('I am logged in', () => {
  cy.visit('http://localhost:4200/login');
  cy.get('#email').type('existinguser@example.com'); 
  cy.get('#password').type('validpassword'); 
  cy.get('button[type="submit"]').contains('Iniciar').click();
  cy.url().should('not.include', '/login'); 
});

Given('I am on the product details page', () => {
  cy.get('.navbar-links').contains('PRODUCTOS').click();
  cy.get('.product-item').first().click();
  cy.get('.details-container').should('be.visible');
});

When('I click the "Add to Wishlist" button', () => {
  cy.get('.wishlist_container_button').click();
});

Then('the product should be added to my wishlist', () => {
  cy.get('#closeButton-detalles').click()
  cy.get('#Wishlist_icon').click();
  cy.get('.wishlist-modal').should('be.visible');
  cy.get('.wishlist-item').should('have.length.greaterThan', 0); 
});

Then('I should see a confirmation message', () => {
  cy.get('.alert').should('be.visible'); 
  cy.get('.close-alert').click()
});

When('I navigate to my wishlist page', () => {
  cy.get('#Wishlist_icon').click();
});

Then('I should see all the products I have added to my wishlist', () => {
  cy.get('.wishlist-modal').should('be.visible');
  cy.get('.wishlist-item').should('have.length.greaterThan', 0); 
});
 
