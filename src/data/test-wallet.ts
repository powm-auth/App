/**
 * Test wallet data
 */

import type { Wallet } from '@/types/powm';
import { Buffer } from 'buffer';

export const TEST_WALLET: Wallet = {
    id: 'wlt_xksx62zbmxxjwz39dmt25vcgc8s4fp9qlpvmr9o',
    created_at: new Date('2025-11-30T04:02:00.229921Z'),
    updated_at: null,
    // PKCS8 DER format
    private_key: Buffer.from('MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgW0ioOcEBcfz1tBGbbvk3l14cqD1/2wqsSWb3a3c5NhqhRANCAASVaaYv10RN9GJ69u35s9K2OUiKMto1JBm9LEHt5ZO/uXK8XnSritwp4kmXcAZaj/gU/f0Bsd3TFNSAZqFNXfny', 'base64'),
    // SPKI DER format
    public_key: Buffer.from('MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAElWmmL9dETfRievbt+bPStjlIijLaNSQZvSxB7eWTv7lyvF50q4rcKeJJl3AGWo/4FP39AbHd0xTUgGahTV358g==', 'base64'),
    signing_algorithm: 'EcdsaP256_Sha256',
    identity_attribute_hashing_scheme: 'hmacsha512',
    attributes: {
        first_name: {
            value: 'John',
            salt: 'c2FsdDEyMzQ1Njc4OTA=' // "salt1234567890" in base64
        },
        last_name: {
            value: 'Doe',
            salt: 'c2FsdGFiY2RlZmdoaWo=' // "saltabcdefghij" in base64
        },
    },
};
