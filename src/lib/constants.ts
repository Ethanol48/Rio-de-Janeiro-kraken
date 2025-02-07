import { hash, verify } from '@node-rs/argon2';

export const LOGIN_REDIRECT = '/login';

export const hashed = hash('Ethanol', {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
});
