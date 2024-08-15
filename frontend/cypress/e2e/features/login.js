/* eslint-disable no-undef */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor/steps';

// Step Definitions

Given('I visit the registration page', () => {
  // Navega a la página de registro
  cy.visit('http://localhost:4200/register'); // Asegúrate de que la URL sea correcta según tu aplicación
});

When('I fill in the registration form with valid details', () => {
  // Llena el formulario de registro con detalles válidos
  cy.get('#first_name').type('John');
  cy.get('#last_name').type('Doe');
  cy.get('#email').type('johndoe@example.com');
  cy.get('#password').type('password123');
});

When('I submit the registration form', () => {
  // Envía el formulario de registro
  cy.get('button[type="submit"]').contains('Registrarse').click();
});

Then('I should see a success message', () => {
  // Verifica que se muestra un mensaje de éxito
  cy.get('.success-message').should('be.visible'); // Ajusta este selector según cómo se muestre el mensaje en tu aplicación
});

Then('I should be able to log in with my new credentials', () => {
  // Inicia sesión con las nuevas credenciales
  cy.visit('/login');
  cy.get('#email').type('johndoe@example.com');
  cy.get('#password').type('password123');
  cy.get('button[type="submit"]').contains('Iniciar').click();
  cy.url().should('not.include', '/login');
});

Given('I visit the login page', () => {
  // Navega a la página de inicio de sesión
  cy.visit('/login');
});

When('I enter valid credentials', () => {
  // Llena el formulario de inicio de sesión con credenciales válidas
  cy.get('#email').type('existinguser@example.com');
  cy.get('#password').type('validpassword');
});

When('I submit the login form', () => {
  // Envía el formulario de inicio de sesión
  cy.get('button[type="submit"]').contains('Iniciar').click();
});

Then('I should be redirected to the homepage', () => {
  // Verifica que el usuario es redirigido a la página de inicio
  cy.url().should('eq', 'http://localhost:4200/home'); // Asegúrate de que la URL coincida con la página de inicio de tu aplicación
});

Then('I should see my user profile in the navbar', () => {
  // Verifica que el perfil de usuario se muestra en la barra de navegación
  cy.get('#logged-user-icon').should('be.visible'); // Selecciona el ícono de usuario en la barra de navegación
});

When('I enter invalid credentials', () => {
  // Llena el formulario de inicio de sesión con credenciales inválidas
  cy.get('#email').type('invaliduser@example.com');
  cy.get('#password').type('wrongpassword');
});

Then('I should see an error message', () => {
  // Verifica que se muestra un mensaje de error
  cy.get('.error-message').should('be.visible'); // Ajusta el selector según cómo se muestre el mensaje de error en tu aplicación
});

