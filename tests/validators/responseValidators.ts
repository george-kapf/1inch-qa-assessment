import { User, Order } from '../interfaces/models';

/**
 * PHASE 2: RUNTIME VALIDATION LOGIC
 * TypeScript interfaces only exist during development. These "Type Guard" 
 * functions ensure the API data is actually correct while the test is running.
 */

/**
 * USER VALIDATOR
 * Requirement: Validates the response structure from Port 3001.
 * Confirms the object contains a numeric ID, a string Name, and a string Email.
 */
export function isValidUser(obj: unknown): obj is User {
  // Guard Clause: Ensure the input is an actual object and not null.
  if (typeof obj !== 'object' || obj === null) return false;
  
  const user = obj as Record<string, unknown>;
  
  // Explicitly check every field type against the 'User' Interface.
  return (
    typeof user.id === 'number' && 
    typeof user.name === 'string' && 
    typeof user.email === 'string'
  );
}

/**
 * ORDER VALIDATOR
 * Requirement: Validates the single order response (e.g., the 35.95 order).
 * Ensures the 'orderId', 'userId', and 'amount' are all present and numeric.
 */
export function isValidOrder(obj: unknown): obj is Order {
  // Guard Clause: Ensure the input is an actual object.
  if (typeof obj !== 'object' || obj === null) return false;
  
  const order = obj as Record<string, unknown>;
  
  // Structural check to confirm the backend is returning the correct data types.
  return (
    typeof order.orderId === 'number' && 
    typeof order.userId === 'number' && 
    typeof order.amount === 'number'
  );
}

/**
 * ORDER COLLECTION VALIDATOR
 * Requirement: Validates the "Retrieve active orders" scenario.
 * Confirms the API returns an Array and that every item in that array is a valid Order.
 */
export function isValidOrderArray(obj: unknown): obj is Order[] {
  // Combines Array-checking with our individual 'isValidOrder' logic.
  return Array.isArray(obj) && obj.every(isValidOrder);
}
