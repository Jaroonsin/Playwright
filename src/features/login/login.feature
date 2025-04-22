@login
Feature: Login Functionality
  As a user of the system,
  I want to be able to log in securely,
  So that I can access my account.

  Background:
    Given the user is on the login page

  Scenario: TC01 - Username is empty
    When the user logs in with username "" and password "anyPassword"
    Then they should see "Login failed. Please try again."

  Scenario: TC02 - Username does not exist in the system
    When the user logs in with username "a@gmail.com" and password "anyPassword"
    Then they should see "Login failed. Please try again."

  Scenario: TC03 - Password is empty
    When the user logs in with username "lessee@example.com" and password ""
    Then they should see "Login failed. Please try again."

  Scenario: TC04 - Password is incorrect
    When the user logs in with username "lessee@example.com" and password "wrongPassword"
    Then they should see "Login failed. Please try again."

  Scenario: TC05 - Username does not exist and password is empty
    When the user logs in with username "a@gmail.com" and password ""
    Then they should see "Login failed. Please try again."

  Scenario: TC06 - Both username and password are empty
    When the user logs in with username "" and password ""
    Then they should see "Login failed. Please try again."

  Scenario: TC07 - Successful login with valid credentials
    When the user logs in with username "lessee@example.com" and password "strongPassword123"
    Then they should navigate to "/users/dashboard"
