// Develop vmgabriel

// Libraries
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Encrypt any password
 * @param pass pass clear
 */
export function encrypt(pass: string): Promise<string> {
  return bcrypt.hash(pass, saltRounds);
}

/**
 * Compare Password
 * @param pass data clear
 * @param toCompareHash Compare data hash password
 */
export function compare(pass: string, toCompareHash: string): Promise<boolean> {
  return bcrypt.compare(pass, toCompareHash);
}
