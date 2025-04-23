@payment
Feature: Payment Functionality
  As a user,
  I want to enter valid card details,
  So that I can complete the payment process.

  Background:
  Given I log in to the dashboard as payment user with email "tanasinp@hotmail.com" and password "strongPassword123"

  Scenario: TC2-7 - All fields valid
    When the user submits payment with:
      | name         | Wave          |
      | number       | 4242424242424242 |
      | month        | 12            |
      | year         | 2030          |
      | securityCode | 123           |
    Then the modal should close
