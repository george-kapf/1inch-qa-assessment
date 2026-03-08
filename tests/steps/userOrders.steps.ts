import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, APIRequestContext, request } from '@playwright/test';
import { isValidUser, isValidOrder, isValidOrderArray } from '../validators/responseValidators';
import { User, Order } from '../interfaces/models';

/**
 * PHASE 3: STEP DEFINITIONS
 * This file maps Gherkin sentences to technical Playwright actions.
 * It manages the "State" (data) between the User Service and Order Service.
 */

// Define the shape of our environment configuration (URLs and timeouts).
type RuntimeConfig = {
  userServiceUrl: string;
  orderServiceUrl: string;
  requestTimeout: number;
};

// State Variables: These act as the "memory" of the test.
// userApiContext/orderApiContext: Isolated communication tunnels for each service.
let userApiContext: APIRequestContext;
let orderApiContext: APIRequestContext;

// lastResponse: Stores the status and JSON from the most recent API call for assertion.
let lastResponse: { status: number; body: unknown };

// retrievedUser: Stores the User 1 object so we can pass its ID to the Order Service.
let retrievedUser: User | null;

/**
 * SETUP HOOK: Runs before every test scenario.
 * Ensures a clean slate and initializes the API connections.
 */
Before(async function (this: { parameters: RuntimeConfig }) {
  // Reset state to prevent data leaking between test runs.
  retrievedUser = null;
  lastResponse = { status: 0, body: null };
  
  const config = this.parameters;

  // Initialize Playwright API contexts with specific Base URLs for ports 3001 and 3002.
  userApiContext = await request.newContext({
    baseURL: config.userServiceUrl,
    timeout: config.requestTimeout,
  });
  orderApiContext = await request.newContext({
    baseURL: config.orderServiceUrl,
    timeout: config.requestTimeout,
  });
});

/**
 * CLEANUP HOOK: Runs after every test scenario.
 * Disposes of the API contexts to free up memory and close connections.
 */
After(async () => {
  await userApiContext?.dispose();
  await orderApiContext?.dispose();
});

/**
 * STEP: Infrastructure Verification
 * Ensures both Dockerized mock services are "Healthy" before starting the test logic.
 */
Given('the services are available', async () => {
  const userHealthResponse = await userApiContext.get('/health');
  const orderHealthResponse = await orderApiContext.get('/health');

  // Assert User Service (3001) is reachable. Requirement: Verify status 200.
  expect(userHealthResponse.status()).toBe(200);
  // Assert Order Service (3002) is reachable. Requirement: Verify status 200.
  expect(orderHealthResponse.status()).toBe(200);
});

/**
 * STEP: User Identity Retrieval
 * Triggers the first half of the journey: Fetching the identity of User 1.
 */
When('I request the user information for user id {int}', async (userId: number) => {
  const response = await userApiContext.get(`/users/${userId}`);
  // Store the response globally so 'Then' steps can validate it.
  lastResponse = {
    status: response.status(),
    body: await response.json(),
  };
});

/**
 * STEP: Sequential Dependency Handling
 * Fetches and validates a user, then saves it to 'retrievedUser' for use in the Order Service.
 */
Given('I have successfully retrieved user {int}', async (userId: number) => {
  const response = await userApiContext.get(`/users/${userId}`);

  // Assert the user lookup returns 200 OK as per assessment requirements.
  expect(response.status()).toBe(200);
  const body = await response.json();

  // Validate that the JSON structure matches our TypeScript 'User' Interface.
  expect(isValidUser(body)).toBe(true);
  
  // Save the user data to be used as a dependency for the next service call.
  retrievedUser = body as User;
});

/**
 * STEP: Internal State Sync
 * Ensures the 'retrievedUser' state is updated from the most recent API call.
 */
Given('I store the retrieved user from the latest response', () => {
  // Assert the previous call was successful (200) before attempting to store.
  expect(lastResponse.status).toBe(200);

  // Use the interface-based validator to ensure the data is safe to store.
  expect(isValidUser(lastResponse.body)).toBe(true);
  retrievedUser = lastResponse.body as User;
});

/**
 * STEP: Order History Retrieval
 * Moves from the User Service to the Order Service using the stored User ID.
 */
When('I request all active orders for the retrieved user', async () => {
  // Pre-condition: Ensure we actually have a user ID from the first service.
  expect(retrievedUser).not.toBeNull();
  
  // Call Order Service (3002) using the ID obtained from User Service (3001).
  const response = await orderApiContext.get(`/orders?userId=${retrievedUser!.id}`);
  lastResponse = {
    status: response.status(),
    body: await response.json(),
  };
});

/**
 * STEP: Transaction Execution
 * Places a new order for the specific amount of 35.95.
 */
When('I place a new order for the retrieved user with an amount of {float}', async (amount: number) => {
  // Pre-condition: Verify we have the User ID to link this order to.
  expect(retrievedUser).not.toBeNull();
  
  // POST request to create the order with the required amount.
  const response = await orderApiContext.post('/orders', { 
    data: { userId: retrievedUser!.id, amount } 
  });
  
  lastResponse = {
    status: response.status(),
    body: await response.json(),
  };
});

/**
 * STEP: Status Verification
 * General assertion to verify HTTP response codes.
 */
Then('the response status should be {int}', (expectedStatus: number) => {
  // Assert HTTP status matches the expected value (usually 200).
  expect(lastResponse.status).toBe(expectedStatus);
});

/**
 * STEP: Data Content Validation
 * Checks the specific fields (id, name, email) returned by the User Service.
 */
Then('the response should contain a valid user with id {int}, name {string}, and email {string}', (id: number, name: string, email: string) => {
  const body = lastResponse.body;

  // Use the interface validator to verify the data structure is correct.
  expect(isValidUser(body)).toBe(true);
  const user = body as User;

  // Assert the specific values match the User 1 scenario.
  expect(user.id).toBe(id);
  expect(user.name).toBe(name);
  expect(user.email).toBe(email);
});

/**
 * STEP: Collection Validation
 * Verifies the Order Service returns a valid array/list of objects.
 */
Then('the response should be a valid array of orders', () => {
  const body = lastResponse.body;
  
  // Assert that the API returned a list format [].
  expect(Array.isArray(body)).toBe(true);

  // Validate that every object inside the array matches our 'Order' Interface.
  expect(isValidOrderArray(body)).toBe(true);
});

/**
 * STEP: Final Transaction Validation
 * The "Gold Standard" test: verifying the 35.95 order was created correctly.
 */
Then('the response should contain a valid order for the retrieved user and amount {float}', (amount: number) => {
  // Ensure we are comparing against the user we retrieved at the start.
  expect(retrievedUser).not.toBeNull();
  const body = lastResponse.body;

  // Validate response structure matches the Order Interface.
  expect(isValidOrder(body)).toBe(true);
  const order = body as Order;

  // Assert orderId exists and is a valid generated number.
  expect(order.orderId).toBeGreaterThan(0);

  // Assert the order is linked to the correct User ID.
  expect(order.userId).toBe(retrievedUser!.id);

  // Assert the final amount is exactly 35.95 as required by the assessment.
  expect(order.amount).toBe(amount);
});
