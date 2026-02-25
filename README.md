# API Test Assessment - 1Inch

BDD API test suite built with Playwright and Cucumber.js. Two lightweight Express mock services run in Docker and act as the system under test.

## Project Structure

```
├── mock-services/
│   ├── user-service.js      # mock user API — port 3001
│   └── order-service.js     # mock order API — port 3002
├── tests/
│   ├── features/
│   │   └── userOrders.feature      # Gherkin scenarios
│   ├── steps/
│   │   └── userOrders.steps.ts     # step definitions
│   ├── interfaces/
│   │   └── models.ts               # User, Order types
│   └── validators/
│       └── responseValidators.ts   # runtime type guards for API responses
├── cucumber.config.js
└── package.json
```

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running
- [Node.js 18+](https://nodejs.org/)

## Getting Started

```bash
npm install
npm run docker:up   # builds and starts both mock services
npm test            # runs tests, generates reports/test-report.html
npm run docker:down
```

You can verify the services are up before running tests:

```bash
curl http://localhost:3001/users/1
# {"id":1,"name":"Alice","email":"alice@example.com"}

curl http://localhost:3002/orders?userId=1
# [{"orderId":1,"userId":1,"amount":49.99}]
```

## Reporting

The default `npm test` generates a simple HTML report at `reports/test-report.html`. If you want the full Allure report:

```bash
npm run test:allure      # runs tests and writes raw results to reports/allure-results
npm run allure:generate  # builds the HTML report into reports/allure-report
npm run allure:open      # opens it in the browser
```

> `allure:generate` and `allure:open` require Java. Install it with `brew install --cask temurin` if you don't have it. In CI, Java is set up automatically.

## Endpoints Under Test

| Service       | Method | Endpoint             | Description           |
| ------------- | ------ | -------------------- | --------------------- |
| User Service  | GET    | `/users/:id`         | Get a user by ID      |
| Order Service | GET    | `/orders?userId=:id` | Get orders for a user |
| Order Service | POST   | `/orders`            | Create a new order    |

## Scenarios

1. **Get user** — fetches user 1, checks HTTP 200, validates `id`, `name`, `email`
2. **Get orders** — fetches orders for user 1, checks HTTP 200, validates the array structure
3. **Create order** — POSTs a new order (user 1, $35.95), checks HTTP 200, validates the response
4. **Full journey** — chains all three into one end-to-end scenario

## Notes

- `responseValidators.ts` does runtime type checking on API responses — if the service returns something unexpected, the test fails with a clear message rather than a vague TypeError further down
- The Cucumber `Background` step pings both services before each scenario so you get an early failure if Docker isn't up
- Playwright's `APIRequestContext` is disposed after each scenario to avoid connection leaks
