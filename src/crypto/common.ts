import crypto, { KeyObject } from 'react-native-quick-crypto';

/**
 * Normalize cryptographic scheme names to lowercase with underscores
 * @param s - Scheme name (e.g., 'EcdsaP256_Sha256' or 'HMAC-SHA512')
 * @returns Normalized scheme (e.g., 'ecdsap256_sha256' or 'hmac_sha512')
 */
export function normalizeScheme(s: string): string {
    return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Convert various key formats to KeyObject
 * @param input - Key in PEM string, base64 DER string, DER buffer, or KeyObject format
 * @param isPrivate - Whether this is a private key (true) or public key (false)
 * @returns KeyObject ready for crypto operations
 */
export function toKeyObject(input: KeyObject | Buffer | string, isPrivate: boolean): KeyObject {
    if (input instanceof KeyObject) return input;

    const isPem = typeof input === 'string' && input.includes('-----BEGIN');

    // If it's a Buffer, use it directly as DER
    let keyData: Buffer | string = input;
    let format: 'pem' | 'der' = 'der';

    if (typeof input === 'string') {
        if (isPem) {
            keyData = input;
            format = 'pem';
        } else {
            // Assume base64 DER string
            keyData = Buffer.from(input, 'base64');
        }
    }

    const type = isPrivate ? 'pkcs8' : 'spki';

    const opts = { key: keyData, format, type } as any;
    return isPrivate ? crypto.createPrivateKey(opts) : crypto.createPublicKey(opts);
}