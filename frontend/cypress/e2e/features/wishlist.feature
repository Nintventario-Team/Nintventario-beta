Feature: Wishlist Management

  Scenario: Add a product to the wishlist
    Given I am logged in
    And I am on the product details page
    When I click the "Add to Wishlist" button
    Then I should see a confirmation message
    And the product should be added to my wishlist

  Scenario: View wishlist
    Given I am logged in
    When I navigate to my wishlist page
    Then I should see all the products I have added to my wishlist
 
