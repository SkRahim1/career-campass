import { SignJWT, jwtVerify } from 'jose';

// Security: JWT_SECRET must be explicitly set in environment.
// Never use a fallback secret in production.
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error(
    'SECURITY ERROR: JWT_SECRET environment variable is not set. ' +
    'Set a strong random JWT_SECRET in your .env.local or deployment environment.'
  );
}

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'career-compass-dev-only-secret-not-for-production'
);

export async function signJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}
