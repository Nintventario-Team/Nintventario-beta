/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I am on the product details page', () => {
  cy.visit('http://localhost:4200/videojuegos')
})

When('I add the product to the cart', () => {
  cy.get('.product-item').get('#addToCart').click()
})

When('I proceed to checkout', () => {
  cy.get('.close-alert').click()
  cy.get('.cart-icon-container').click()
  cy.get('.cart-modal').should('be.visible')
  cy.get('button').contains('FINALIZAR COMPRA').click()
})

Then('I should be redirected to the login page if I am not logged in', () => {
  cy.url().should('include', '/login')
})

Given('I am logged in', () => {
  cy.visit('/login')
  cy.get('#email').type('existinguser@example.com')
  cy.get('#password').type('validpassword')
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

Given('I have products in my cart', () => {
  cy.get('.navbar-links').contains('PRODUCTOS').click()
  cy.get('.product-item').get('#addToCart').click()
})

Then('I should see the paypal boton', () => {
  cy.get('#paypal-button-container').should('be.visible')
})

Then('I should see the products to buy', () => {
  cy.get('.cart-modal').should('exist')
  cy.get('.cart-modal').children().should('have.length.greaterThan', 0)
})
