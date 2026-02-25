import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, APIRequestContext, request } from '@playwright/test';
import { isValidUser, isValidOrder, isValidOrderArray } from '../validators/responseValidators';
import { User, Order } from '../interfaces/models';

type RuntimeConfig = {
  userServiceUrl: string;
  orderServiceUrl: string;
  requestTimeout: number;
};

let userApiContext: APIRequestContext;
let orderApiContext: APIRequestContext;
let lastResponse: { status: number; body: unknown };
let retrievedUser: User | null;

Before(async function (this: { parameters: RuntimeConfig }) {
  retrievedUser = null;
  lastResponse = { status: 0, body: null };
  const config = this.parameters;
  userApiContext = await request.newContext({
    baseURL: config.userServiceUrl,
    timeout: config.requestTimeout,
  });
  orderApiContext = await request.newContext({
    baseURL: config.orderServiceUrl,
    timeout: config.requestTimeout,
  });
});

After(async () => {
  await userApiContext?.dispose();
  await orderApiContext?.dispose();
});

Given('the services are available', async () => {
  const userHealthResponse = await userApiContext.get('/health');
  const orderHealthResponse = await orderApiContext.get('/health');

  // Assert User Service is reachable before executing API scenarios.
  expect(userHealthResponse.status()).toBe(200);
  // Assert Order Service is reachable before executing API scenarios.
  expect(orderHealthResponse.status()).toBe(200);
});

When('I request the user information for user id {int}', async (userId: number) => {
  const response = await userApiContext.get(`/users/${userId}`);
  lastResponse = {
    status: response.status(),
    body: await response.json(),
  };
});

Given('I have successfully retrieved user {int}', async (userId: number) => {
  const response = await userApiContext.get(`/users/${userId}`);

  // Assert the user lookup endpoint returns success for the requested user.
  expect(response.status()).toBe(200);
  const body = await response.json();

  // Assert response payload matches the expected User interface.
  expect(isValidUser(body)).toBe(true);
  retrievedUser = body as User;
});

Given('I store the retrieved user from the latest response', () => {
  // Assert we previously received a successful response before storing user data.
  expect(lastResponse.status).toBe(200);

  // Assert latest payload is structurally compatible with the User interface.
  expect(isValidUser(lastResponse.body)).toBe(true);
  retrievedUser = lastResponse.body as User;
});

When('I request all active orders for the retrieved user', async () => {
  expect(retrievedUser).not.toBeNull();
  const response = await orderApiContext.get(`/orders?userId=${retrievedUser!.id}`);
  lastResponse = {
    status: response.status(),
    body: await response.json(),
  };
});

When('I place a new order for the retrieved user with an amount of {float}', async (amount: number) => {
  expect(retrievedUser).not.toBeNull();
  const response = await orderApiContext.post('/orders', { data: { userId: retrievedUser!.id, amount } });
  lastResponse = {
    status: response.status(),
    body: await response.json(),
  };
});

Then('the response status should be {int}', (expectedStatus: number) => {
  // Assert HTTP status aligns with the scenario expectation.
  expect(lastResponse.status).toBe(expectedStatus);
});

Then('the response should contain a valid user with id {int}, name {string}, and email {string}', (id: number, name: string, email: string) => {
  const body = lastResponse.body;

  // Assert payload has all fields required by the User interface.
  expect(isValidUser(body)).toBe(true);
  const user = body as User;

  // Assert the returned user id matches the requested identifier.
  expect(user.id).toBe(id);

  // Assert the returned user name is the expected canonical value.
  expect(user.name).toBe(name);

  // Assert the returned email matches the expected user email.
  expect(user.email).toBe(email);
});

Then('the response should be a valid array of orders', () => {
  const body = lastResponse.body;
  // Assert endpoint returns a list of orders, not a single object.
  expect(Array.isArray(body)).toBe(true);

  // Assert every item in the list conforms to the Order interface.
  expect(isValidOrderArray(body)).toBe(true);
});

Then('the response should contain a valid order for the retrieved user and amount {float}', (amount: number) => {
  // Assert user context was set before placing/validating an order.
  expect(retrievedUser).not.toBeNull();
  const body = lastResponse.body;

  // Assert payload has all fields required by the Order interface.
  expect(isValidOrder(body)).toBe(true);
  const order = body as Order;

  // Assert newly created order has a generated positive identifier.
  expect(order.orderId).toBeGreaterThan(0);

  // Assert created order is associated with the same retrieved user.
  expect(order.userId).toBe(retrievedUser!.id);

  // Assert created order amount matches the requested amount exactly.
  expect(order.amount).toBe(amount);
});
