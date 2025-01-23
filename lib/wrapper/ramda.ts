export * from 'ramda';
import { isEmpty, isNil } from 'ramda';

export function isNilEmpty<T>(value: T) {
  return isNil(value) || isEmpty(value);
}

export function isNotNilEmpty<T>(value: T) {
  return !isNilEmpty(value);
}

export function isTruthy(str?: string) {
  return str?.toLowerCase() === 'true';
}

export function getKeys<T extends { [key: string]: unknown }>(obj: T): (keyof T)[] {
  return Object.keys(obj);
}
