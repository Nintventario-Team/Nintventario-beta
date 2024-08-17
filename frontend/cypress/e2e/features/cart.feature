Feature: Cart

  Scenario: Add product to cart and checkout
    Given I am on the product details page
    When I add the product to the cart
    And I proceed to checkout
    Then I should be redirected to the login page if I am not logged in

  Scenario: User go to checkout
    Given I am logged in
    And I have products in my cart
    When I proceed to checkout
    Then I should see the paypal boton
    And I should see the products to buy
 
