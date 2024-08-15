Feature: Checkout and Payment

  Scenario: Add product to cart and checkout
    Given I am on the product details page
    When I add the product to the cart
    And I proceed to checkout
    Then I should be redirected to the login page if I am not logged in

  Scenario: User completes a purchase
    Given I am logged in
    And I have products in my cart
    When I proceed to checkout
    And I choose PayPal as the payment method
    And I complete the payment
    Then I should see a confirmation of my order
    And the products should be removed from my cart
 
