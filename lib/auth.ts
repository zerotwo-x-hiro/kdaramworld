import { cookies } from 'next/headers';
import crypto from 'node:crypto';

export interface UserSession {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('kdrama_session')?.value;
    if (!sessionToken) return null;

    // In Phase 3, this reads and verifies HMAC token in DB.
    // For now, if no DB or invalid token, safely return null.
    return null;
  } catch {
    return null;
  }
}

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}
