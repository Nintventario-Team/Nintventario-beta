Feature: Product Listing

  Scenario: View all available products
    Given I visit the homepage
    When I navigate to the products section
    Then I should see a list of all available products
    And each product should have a title, image, and price

  Scenario: View product details
    Given I am on the products page
    When I click on a product
    Then I should be redirected to the product details page
    And I should see detailed information about the product
    And I should see an option to add the product to the wishlist or cart
 
