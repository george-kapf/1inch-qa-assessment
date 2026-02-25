import { User, Order } from '../interfaces/models';

export function isValidUser(obj: unknown): obj is User {
  if (typeof obj !== 'object' || obj === null) return false;
  const user = obj as Record<string, unknown>;
  return typeof user.id === 'number' && typeof user.name === 'string' && typeof user.email === 'string';
}

export function isValidOrder(obj: unknown): obj is Order {
  if (typeof obj !== 'object' || obj === null) return false;
  const order = obj as Record<string, unknown>;
  return typeof order.orderId === 'number' && typeof order.userId === 'number' && typeof order.amount === 'number';
}

export function isValidOrderArray(obj: unknown): obj is Order[] {
  return Array.isArray(obj) && obj.every(isValidOrder);
}
