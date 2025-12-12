import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';

// Setup global Buffer polyfill
global.Buffer = Buffer;

// Polyfill for global.crypto.getRandomValues (required by @noble libraries)
const polyfillCrypto = {
    getRandomValues: function <T extends ArrayBufferView | null>(array: T): T {
        if (array) {
            return Crypto.getRandomValues(array as any) as any;
        }
        return array;
    }
};

if (typeof global.crypto === 'undefined') {
    (global as any).crypto = polyfillCrypto;
} else if (typeof global.crypto.getRandomValues === 'undefined') {
    (global.crypto as any).getRandomValues = polyfillCrypto.getRandomValues;
}

// Also try globalThis for good measure
if (typeof globalThis.crypto === 'undefined') {
    (globalThis as any).crypto = polyfillCrypto;
} else if (typeof globalThis.crypto.getRandomValues === 'undefined') {
    (globalThis.crypto as any).getRandomValues = polyfillCrypto.getRandomValues;
}

