/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Step Definitions

Given('I visit the registration page', () => {
  cy.visit('http://localhost:4200/register'); 
});

When('I fill in the registration form with valid details', () => {
  cy.get('#first_name').type('John');
  cy.get('#last_name').type('Doe');
  cy.get('#email').type('johndoe@example.com');
  cy.get('#password').type('password123');
});

When('I submit the registration form', () => {
  cy.get('button[type="submit"]').contains('Registrarse').click();
});

Then('I should see a success message', () => {
  cy.get('.alert').should('be.visible'); 
});

Then('I should be able to log in with my new credentials', () => {
  cy.visit('/login');
  cy.get('#email').type('johndoe@example.com');
  cy.get('#password').type('password123');
  cy.get('button[type="submit"]').contains('Iniciar').click();
  cy.url().should('not.include', '/login');
});

Given('I visit the login page', () => {
  cy.visit('/login');
});

When('I enter valid credentials', () => {
  cy.get('#email').type('existinguser@example.com');
  cy.get('#password').type('validpassword');
});

When('I submit the login form', () => {
  cy.get('button[type="submit"]').contains('Iniciar').click();
});

Then('I should be redirected to the homepage', () => {
  cy.url().should('eq', 'http://localhost:4200/'); 
});

Then('I should see my user profile in the navbar', () => {
  cy.get('#logged-user-icon').should('be.visible'); 
});

When('I enter invalid credentials', () => {
  cy.get('#email').type('invaliduser@example.com');
  cy.get('#password').type('wrongpassword');
});

Then('I should see an error message', () => {
  cy.get('.error-alert').should('be.visible'); 
});

