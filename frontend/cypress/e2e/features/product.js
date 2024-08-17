/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';


Given('I visit the homepage', () => {
  cy.visit('http://localhost:4200/');
});

When('I navigate to the products section', () => {
  cy.get('.navbar-links').contains('PRODUCTOS').click();
  cy.get('#products-container').should('be.visible');
});

Then('I should see a list of all available products', () => {
  cy.get('.product-item').should('have.length.greaterThan', 0);
});

Then('each product should have a title, image, and price', () => {
  cy.get('.product-item').each(($product) => {
    cy.wrap($product).find('.product-name').should('not.be.empty');
    cy.wrap($product).find('.img-product').should('have.attr', 'src').and('not.be.empty');
    cy.wrap($product).find('.price-product').should('not.be.empty');
  });
});

Given('I am on the products page', () => {
  cy.visit('/todos'); 
});

When('I click on a product', () => {
  cy.get('.product-item').first().click();
});

Then('I should  see the modal product details page', () => {
  cy.get('.details-container').should('be.visible');

});

Then('I should see detailed information about the product', () => {
  cy.get('#img-detalles').should('have.attr', 'src').and('not.be.empty');
  cy.get('#nombre-text').should('not.be.empty');
  cy.get('#precio-text').should('not.be.empty');
  cy.get('#detalles-text').should('not.be.empty');
  cy.get('#desc-text').should('not.be.empty');
});

Then('I should see an option to add the product to the wishlist or cart', () => {
  cy.get('#addToWishlist').should('be.visible');
  cy.get('#addToCart-detalles').should('be.visible');
});
