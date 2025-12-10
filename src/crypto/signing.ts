import { Buffer } from 'buffer';
import crypto, { KeyObject } from 'react-native-quick-crypto';
import { normalizeScheme, toKeyObject } from './common';

export type SignatureScheme =
    | 'eddsaed25519'
    | 'ecdsap256_sha256'
    | 'ecdsap256_sha384'
    | 'ecdsap384_sha384'
    | 'ecdsap384_sha512';

const HASH_MAP: Record<string, string | null> = {
    eddsaed25519: null,
    ecdsap256_sha256: 'sha256',
    ecdsap256_sha384: 'sha384',
    ecdsap384_sha384: 'sha384',
    ecdsap384_sha512: 'sha512',
};

const CURVE_MAP: Record<string, 'ed25519' | 'P-256' | 'P-384'> = {
    eddsaed25519: 'ed25519',
    ecdsap256_sha256: 'P-256',
    ecdsap256_sha384: 'P-256',
    ecdsap384_sha384: 'P-384',
    ecdsap384_sha512: 'P-384',
};

function getHashAlgo(scheme: string): string | null {
    const normalized = normalizeScheme(scheme);
    if (!(normalized in HASH_MAP)) throw new Error(`Unsupported signing scheme: ${scheme}`);
    return HASH_MAP[normalized];
}

function getCurve(scheme: string): 'ed25519' | 'P-256' | 'P-384' {
    const normalized = normalizeScheme(scheme);
    if (!(normalized in CURVE_MAP)) throw new Error(`Unsupported signing scheme: ${scheme}`);
    return CURVE_MAP[normalized];
}

export function isSchemeSupported(scheme: string): boolean {
    return normalizeScheme(scheme) in HASH_MAP;
}

/**
 * Generate a key pair for signing
 * @param scheme - Signature scheme (e.g., 'ecdsap256_sha256', 'eddsaed25519')
 * @returns Private key (PKCS8 DER) and public key (SPKI DER) as Buffers
 */
export function generateKeyPair(scheme: string): { privateKeyPkcs8Der: Buffer; publicKeySpkiDer: Buffer } {
    const curve = getCurve(scheme);

    if (curve === 'ed25519') {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: { type: 'spki', format: 'der' },
            privateKeyEncoding: { type: 'pkcs8', format: 'der' }
        });
        return {
            privateKeyPkcs8Der: Buffer.from(privateKey as unknown as Uint8Array),
            publicKeySpkiDer: Buffer.from(publicKey as unknown as Uint8Array),
        };
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: curve });

    return {
        privateKeyPkcs8Der: (privateKey as any).export({ type: 'pkcs8', format: 'der' }) as Buffer,
        publicKeySpkiDer: (publicKey as any).export({ type: 'spki', format: 'der' }) as Buffer,
    };
}

/**
 * Sign data with private key
 * @param scheme - Signature scheme (e.g., 'ecdsap256_sha256', 'eddsaed25519')
 * @param privateKey - Private key for signing (PEM, DER, or KeyObject)
 * @param data - Data to sign
 * @returns Digital signature
 */
export function sign(scheme: string, privateKey: KeyObject | Buffer | string, data: Buffer): Buffer {
    const keyObj = toKeyObject(privateKey, true);
    const hashAlgo = getHashAlgo(scheme);

    const signer = crypto.createSign(hashAlgo || 'sha256');
    signer.update(data);
    return Buffer.from(signer.sign(keyObj));
}

/**
 * Verify signature with public key
 * @param scheme - Signature scheme (e.g., 'ecdsap256_sha256', 'eddsaed25519')
 * @param publicKey - Public key for verification (PEM, DER, or KeyObject)
 * @param data - Original data that was signed
 * @param signature - Signature to verify
 * @returns True if signature is valid, false otherwise
 */
export function verify(scheme: string, publicKey: KeyObject | Buffer | string, data: Buffer, signature: Buffer): boolean {
    const keyObj = toKeyObject(publicKey, false);
    const hashAlgo = getHashAlgo(scheme);

    const verifier = crypto.createVerify(hashAlgo || 'sha256');
    verifier.update(data);
    return Boolean(verifier.verify(keyObj, signature));
}
