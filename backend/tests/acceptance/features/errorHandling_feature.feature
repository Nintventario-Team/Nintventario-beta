Feature: Error Handling and Validation

  Scenario: Attempt to create an order with insufficient product quantity
    Given a product exists with a quantity of "1"
    When I attempt to create an order with a quantity of "2" for that product
    Then I should receive a "400" status
    And I should see an error message "Insufficient quantity"

  Scenario: Attempt to view a product that does not exist
    When I attempt to view the product with ID "9999"
    Then I should receive a "404" status
    And I should see an error message "Product not found"

  Scenario: Attempt to register with an already taken email
    Given a user already exists with the email "existinguser@example.com"
    When I attempt to register with the email "existinguser@example.com"
    Then I should receive a "400" status
    And I should see an error message "Email already exists"
