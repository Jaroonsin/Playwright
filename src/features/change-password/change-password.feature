@changePassword
Feature: Password Change Validation
  As a registered user
  I want to securely change my password
  So that I can maintain control over my account access


  Scenario: TC3-1 - Successfully change password with correct current and valid new password
    Given the user with email "massakorne@gmail.com" has the old password "strongPassword123"
    When the current password is "strongPassword123"
    And the new password is "newPassword123"
    And the confirm new password is "newPassword123"
    Then I should see "Password reset successfully!"

  Scenario: TC3-2 - Fail to change password with incorrect current password
    Given the user with email "massakorne@gmail.com" has the old password "newPassword123"
    When the current password is "Hello"
    And the new password is "newPassword123"
    And the confirm new password is "newPassword123"
    Then I should see "Failed to reset password"

  Scenario: TC3-3 - Fail to change password when current password is empty
    Given the user with email "massakorne@gmail.com" has the old password "newPassword123"
    When the current password is " "
    And the new password is "newPassword123"
    And the confirm new password is "newPassword123"
    Then I should see "Failed to reset password"

  Scenario: TC3-4 - Fail to change password when new password is empty and confirmation does not match
    Given the user with email "massakorne@gmail.com" has the old password "newPassword123"
    When the current password is "strongPassword123"
    And the new password is " "
    And the confirm new password is "1234"
    Then I should see "Passwords do not match"

  Scenario: TC3-5 - Fail to change password when new password is too short
    Given the user with email "massakorne@gmail.com" has the old password "newPassword123"
    When the current password is "strongPassword123"
    And the new password is "new"
    And the confirm new password is "new"
    Then I should see "Failed to reset password"

  Scenario: TC3-6 - Fail to change password when new and confirm passwords do not match
    Given the user with email "massakorne@gmail.com" has the old password "newPassword123"
    When the current password is "strongPassword123"
    And the new password is "newPassword123"
    And the confirm new password is "new"
    Then I should see "Passwords do not match"

  Scenario: TC3-7 - Successfully change password with correct current and valid new password
    Given the user with email "massakorne@gmail.com" has the old password "newPassword123"
    When the current password is "newPassword123"
    And the new password is "strongPassword123"
    And the confirm new password is "strongPassword123"
    Then I should see "Password reset successfully!"
