Feature: User and Order Service API
  As a client of the system
  I want to retrieve user information and manage orders
  So that I can interact with the platform on behalf of a user

  Background:
    Given the services are available

  Scenario Outline: Retrieve user information
    When I request the user information for user id <userId>
    Then the response status should be <status>
    And the response should contain a valid user with id <userId>, name "<name>", and email "<email>"

    Examples:
      | userId | status | name  | email             |
      | 1      | 200    | Alice | alice@example.com |

  Scenario Outline: Retrieve active orders
    Given I have successfully retrieved user <userId>
    When I request all active orders for the retrieved user
    Then the response status should be <status>
    And the response should be a valid array of orders

    Examples:
      | userId | status |
      | 1      | 200    |

  Scenario Outline: Place a new order
    Given I have successfully retrieved user <userId>
    When I place a new order for the retrieved user with an amount of <amount>
    Then the response status should be <status>
    And the response should contain a valid order for the retrieved user and amount <amount>

    Examples:
      | userId | amount | status |
      | 1      | 35.95  | 200    |

  Scenario Outline: Complete user order journey
    When I request the user information for user id <userId>
    Then the response status should be <status>
    And the response should contain a valid user with id <userId>, name "<name>", and email "<email>"
    And I store the retrieved user from the latest response
    When I request all active orders for the retrieved user
    Then the response status should be <status>
    And the response should be a valid array of orders
    When I place a new order for the retrieved user with an amount of <amount>
    Then the response status should be <status>
    And the response should contain a valid order for the retrieved user and amount <amount>

    Examples:
      | userId | status | name  | email             | amount |
      | 1      | 200    | Alice | alice@example.com | 35.95  |
