import { withSigningKey } from '@/wallet/storage';
import { signing } from '@powm/sdk-js/crypto';
import { Buffer } from 'buffer';
import { POWM_API_BASE } from './constants';
import {
    ConsumeIdentityVerificationError,
    ConsumeIdentityVerificationRequest,
    ConsumeIdentityVerificationResponse,
    Wallet
} from './structs';

/**
 * Consume identity verification results and build wallet with identity attributes
 * This is called after identity verification status is 'accepted_awaiting_consumption'
 */
export async function consumeIdentityVerification(
    wallet: Wallet
): Promise<ConsumeIdentityVerificationResponse> {
    try {
        const time = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); // Remove milliseconds
        const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');

        // Build signing string according to server format
        const signingString = [
            'v1/wallets/consume-identity-verification',
            time,
            nonce,
            wallet.id,
            ''
        ].join('|');

        // Sign the request
        const signature = await withSigningKey((privateKey) => {
            const sig = signing.sign(
                wallet.signing_algorithm,
                privateKey,
                Buffer.from(signingString, 'utf8') as any
            );
            return Buffer.from(sig).toString('base64');
        });

        const requestBody: ConsumeIdentityVerificationRequest = {
            time,
            nonce,
            wallet_id: wallet.id,
            wallet_signature: signature,
        };

        const response = await fetch(`${POWM_API_BASE}/wallets/consume-identity-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorCode: ConsumeIdentityVerificationError['code'] = 'REQUEST_FAILED';

            if (response.status === 401) {
                errorCode = 'UNAUTHORIZED';
            } else if (response.status >= 500) {
                errorCode = 'NETWORK_ERROR';
            }

            throw new ConsumeIdentityVerificationError(
                errorCode,
                `Failed to consume identity verification: ${response.status}`,
                response.status,
                errorText
            );
        }

        const result: ConsumeIdentityVerificationResponse = await response.json();
        return result;
    } catch (error) {
        if (error instanceof ConsumeIdentityVerificationError) {
            throw error;
        }

        throw new ConsumeIdentityVerificationError(
            'UNKNOWN',
            'Unexpected error during identity verification consumption',
            undefined,
            undefined,
            error as Error
        );
    }
}
