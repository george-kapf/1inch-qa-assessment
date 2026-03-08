/**
 * PHASE 2: DATA MODELS (CONTRACT DEFINITIONS)
 * These interfaces define the "Contract" between the services and the test suite.
 * They ensure that both the User and Order services return the exact fields required.
 */

/**
 * USER INTERFACE
 * Represents the identity data returned by the User Service (Port 3001).
 * Requirement: Must include id, name, and email fields.
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * ORDER INTERFACE
 * Represents a complete order object returned by the Order Service (Port 3002).
 * This structure is used to validate existing orders and the newly created 35.95 order.
 */
export interface Order {
  orderId: number;
  userId: number;
  amount: number;
}

/**
 * CREATE ORDER REQUEST INTERFACE
 * Defines the payload structure sent to the Order Service POST endpoint.
 * Ensures the test runner sends the correct data types for userId and amount (35.95).
 */
export interface CreateOrderRequest {
  userId: number;
  amount: number;
}
