# PHASE 2: BDD SCENARIO DEFINITION
# This file describes the "What" (Business Logic) in plain English.
# It ensures that stakeholders and developers have a shared understanding of the test.
Feature: User and Order Service API
  As a client of the system
  I want to retrieve user information and manage orders
  So that I can interact with the platform on behalf of a user

  # PRE-CONDITION:
  # The Background ensures that the 'health' check passes for both Docker services 
  # (Ports 3001 and 3002) before any scenario logic begins.
  Background:
    Given the services are available

  # SCENARIO 1: IDENTITY VERIFICATION
  # This validates the User Service (Port 3001) fulfills the "User 1 / Alice" requirement.
  Scenario Outline: Retrieve user information
    When I request the user information for user id <userId>
    Then the response status should be <status>
    And the response should contain a valid user with id <userId>, name "<name>", and email "<email>"

    Examples:
      | userId | status | name  | email             |
      | 1      | 200    | Alice | alice@example.com |

  # SCENARIO 2: HISTORY VERIFICATION
  # This verifies the Order Service (Port 3002) can retrieve existing data 
  # for a user provided by the User Service.
  Scenario Outline: Retrieve active orders
    Given I have successfully retrieved user <userId>
    When I request all active orders for the retrieved user
    Then the response status should be <status>
    And the response should be a valid array of orders

    Examples:
      | userId | status |
      | 1      | 200    |

  # SCENARIO 3: TRANSACTIONAL VERIFICATION
  # This validates the core requirement: placing a new order for exactly 35.95.
  Scenario Outline: Place a new order
    Given I have successfully retrieved user <userId>
    When I place a new order for the retrieved user with an amount of <amount>
    Then the response status should be <status>
    And the response should contain a valid order for the retrieved user and amount <amount>

    Examples:
      | userId | amount | status |
      | 1      | 35.95  | 200    |

  # SCENARIO 4: END-TO-END USER JOURNEY
  # This combines all steps into a single sequence to prove the services 
  # are correctly "handshaking" and maintaining state across the full 35.95 transaction.
  Scenario Outline: Complete user order journey
    When I request the user information for user id <userId>
    Then the response status should be <status>
    And the response should contain a valid user with id <userId>, name "<name>", and email "<email>"
    
    # STATE MANAGEMENT: This step triggers the capture of User 1's ID in the code.
    And I store the retrieved user from the latest response
    
    When I request all active orders for the retrieved user
    Then the response status should be <status>
    And the response should be a valid array of orders
    
    # FINAL ACTION: Executing the 35.95 order creation.
    When I place a new order for the retrieved user with an amount of <amount>
    Then the response status should be <status>
    And the response should contain a valid order for the retrieved user and amount <amount>

    Examples:
      | userId | status | name  | email             | amount |
      | 1      | 200    | Alice | alice@example.com | 35.95  |
