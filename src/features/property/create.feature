@createProperty
Feature: Create Property Functionality
  As a logged-in user,
  I want to be able to create a new property,
  So that I can list it in the system.

  Background:
    Given I log in to the dashboard page with email "lessor99@example.com" and password "strongPassword123"

# Scenario: TC01 - Successfully create a property with all required fields via panel
#     Given I am on the property listing page 
#     When I click the "Create new property" button
#     And I fill in the property details in the panel with:
#         | Field           | Value             |
#         | Image          | test.jpg |
#         | Property Name   | My Awesome Place  | 
#         | Property Location | City Center       |
#         | Property Detail | A cozy apartment  |
#         | Size (Square meter) | 75.5              |
#         | Price (Baht per month) | 15000             |
#     And I click the "Create Property" button in the panel
#     Then the new property "My Awesome Place" should appear in the property list 

  Scenario: TC02 - Attempt to create property with missing required field (Property Name)
    Given I am on the property listing page
    When I click the "Create new property" button
    And I fill in the property details in the panel with:
      # Property Name is intentionally left out
      | Field                  | Value             |
      | Property Location      | Somewhere Nice    |
      | Size (Square meter)    | 50                |
      | Price (Baht per month) | 10000             |
      # Add other required fields here, except Property Name
    And I click the "Create Property" button in the panel
    Then I should see a validation error message for the "*Name is required" field
    And the property creation panel should still be visible

  Scenario: TC03 - Attempt to create property with missing required field (Price)
    Given I am on the property listing page
    When I click the "Create new property" button
    And I fill in the property details in the panel with:
      # Price is intentionally left out
      | Field                  | Value             |
      | Property Name          | Cheap Place       |
      | Property Location      | Outskirts         |
      | Size (Square meter)    | 30                |
      # Add other required fields here, except Price
    And I click the "Create Property" button in the panel
    Then I should see a validation error message for the "*Price required more than 20 Baht" field
    And the property creation panel should still be visible
