@createProperty
Feature: Create Property Functionality
  As a logged-in user,
  I want to be able to create a new property,
  So that I can list it in the system.

  Background:
    Given I log in to the dashboard page with email "lessor99@example.com" and password "strongPassword123"

  Scenario Outline: TC01-TC05 - Attempt to create property with missing required field
    Given I am on the property listing page
    When I click the "Create new property" button
    And I fill in the property details in the panel with:
      | Field                 | Value               |
      | Image                 | <Image>             |
      | Property Name         | <PropertyName>      |
      | Property Location     | <PropertyLocation>  |
      | Property Detail       |<PropertyDetail>        |
      | Size (Square meter)   | <PropertySize>                  |
      | Price (Baht per month) | <PropertyPrice>              |
    And I click the "Create Property" button in the panel
    Then I should see a validation error message matching <ErrorMessage>
    And the property creation panel should still be visible

    Examples: TC01 - Missing Image
      | Field             | Image         | PropertyName    | PropertyDetail | PropertySize | PropertyPrice PropertyLocation | ErrorMessage                      |
      | Missing Image     |               | Cozy Studio     |               | 50           | 10000          Near BTS Station | "*Image is required"             |

    Examples: TC02 - Missing Name
      | Field         | Image    | PropertyName | PropertyLocation | PropertyDetail | PropertySize | PropertyPrice | ErrorMessage            |
      | Missing Name  | test.jpg |              | Riverside Area   |               | 50           | 10000         | "*Name is required"     |

    Examples: TC03 - Missing Price
      | Field         | Image    | PropertyName | PropertyLocation | PropertyDetail | PropertySize | PropertyPrice | ErrorMessage                      |
      | Missing Price | test.jpg | Family Home  | Suburban Area   |               | 80           |               | "*Price required more than 20 Baht"             |

    Examples: TC04 - Missing Size
      | Field        | Image    | PropertyName       | PropertyLocation | PropertyDetail | PropertySize | PropertyPrice | ErrorMessage                  |
      | Missing Size | test.jpg | Minimalist Living  | Downtown Core    |               |              | 25000         | "*Size required more than zero"              |

    Examples: TC05 - Missing Location
      | Field            | Image    | PropertyName      | PropertyLocation | PropertyDetail | PropertySize | PropertyPrice | ErrorMessage            |
      | Missing Location | test.jpg | Commercial Space  |                 |               | 120          | 35000         | "*Location is required" |

  Scenario Outline: TC06-TC07 - Successfully create a property with optional detail
    Given I am on the property listing page
    When I click the "Create new property" button
    And I fill in the property details in the panel with:
      | Field                 | Value                     |
      | Image                 | <Image>                   |
      | Property Name         | <PropertyName>            |
      | Property Location     | <PropertyLocation>        |
      | Property Detail       | <PropertyDetail>          |
      | Size (Square meter)   | <Size>                    |
      | Price (Baht per month) | <Price>                   |
    And I click the "Create Property" button in the panel
    Then the new property <PropertyName> should appear in the property list

    Examples: TC06 - Successful creation without optional detail
      | Image       | PropertyName    | PropertyLocation | PropertyDetail | Size  | Price  |
      | test.jpg   | "Luxury Villa"    | Beachfront       |              | 250   | 80000  |

    Examples: TC07 - Successful creation with optional detail
      | Image           | PropertyName      | PropertyLocation        | PropertyDetail          | Size  | Price   |
      | test.jpg  | "Penthouse Suite"   | Rooftop with City View    | Exclusive and spacious    | 300   | 120000  |

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

  # Scenario: TC02 - Attempt to create property with missing required field (Property Name)
  #   Given I am on the property listing page
  #   When I click the "Create new property" button
  #   And I fill in the property details in the panel with:
  #     # Property Name is intentionally left out
  #     | Field                  | Value             |
  #     | Property Location      | Somewhere Nice    |
  #     | Size (Square meter)    | 50                |
  #     | Price (Baht per month) | 10000             |
  #     # Add other required fields here, except Property Name
  #   And I click the "Create Property" button in the panel
  #   Then I should see a validation error message matching "*Name is required"  
  #   And the property creation panel should still be visible

  # Scenario: TC03 - Attempt to create property with missing required field (Price)
  #   Given I am on the property listing page
  #   When I click the "Create new property" button
  #   And I fill in the property details in the panel with:
  #     # Price is intentionally left out
  #     | Field                  | Value             |
  #     | Property Name          | Cheap Place       |
  #     | Property Location      | Outskirts         |
  #     | Size (Square meter)    | 30                |
  #     # Add other required fields here, except Price
  #   And I click the "Create Property" button in the panel
  #   Then I should see a validation error message matching "*Price required more than 20 Baht"
  #   And the property creation panel should still be visible
