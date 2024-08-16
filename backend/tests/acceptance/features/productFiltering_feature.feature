Feature: Filtered Product View

  Scenario: View filtered products by category
    Given a category named "Electronics" exists
    And a product exists with name "Smartphone" in the "Electronics" category
    When I view products filtered by the "Electronics" category
    Then I should see the product "Smartphone"
