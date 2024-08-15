Feature: User Authentication

  Scenario: User registers an account
    Given I visit the registration page
    When I fill in the registration form with valid details
    And I submit the registration form
    Then I should see a success message
    And I should be able to log in with my new credentials

  Scenario: User logs in with valid credentials
    Given I visit the login page
    When I enter valid credentials
    And I submit the login form
    Then I should be redirected to the homepage
    And I should see my user profile in the navbar

  Scenario: User cannot log in with invalid credentials
    Given I visit the login page
    When I enter invalid credentials
    And I submit the login form
    Then I should see an error message

