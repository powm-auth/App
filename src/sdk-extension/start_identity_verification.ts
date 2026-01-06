import { withSigningKey } from '@/wallet/storage';
import { signing } from '@powm/sdk-js/crypto';
import * as Crypto from 'expo-crypto';
import { POWM_API_BASE } from './constants';
import { StartIdentityVerificationError, StartIdentityVerificationRequest, StartIdentityVerificationResponse, Wallet } from './structs';
import { fetchWithTimeout, uint8ArrayToBase64, utf8ToUint8Array } from './utils';

export async function startIdentityVerification(
    wallet: Wallet,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    successUrl: string,
    cancelUrl: string
): Promise<StartIdentityVerificationResponse> {
    // 1. Generate time and nonce
    // Server expects time format without milliseconds: yyyy-MM-ddTHH:mm:ssZ
    const time = new Date().toISOString().split('.')[0] + 'Z';
    const nonce = Crypto.randomUUID().replace(/-/g, '');

    // 2. Construct the string to sign
    // Format: endpoint|time|nonce|walletId|firstName|lastName|dob|successUrl|cancelUrl|

    const endpoint = 'v1/wallets/start-identity-verification';
    const signString = `${endpoint}|${time}|${nonce}|${wallet.id}|${firstName}|${lastName}|${dateOfBirth}|${successUrl}|${cancelUrl}|`;

    // 3. Sign the string
    const signatureBase64 = await withSigningKey(async (privateKey) => {
        // Ensure privateKey is passed as Uint8Array to avoid Buffer version mismatches
        const keyBytes = new Uint8Array(privateKey);
        const signatureBytes = await signing.sign(
            wallet.signing_algorithm,
            keyBytes,
            utf8ToUint8Array(signString)
        );
        return uint8ArrayToBase64(signatureBytes);
    });

    // 4. Prepare the request
    const requestBody: StartIdentityVerificationRequest = {
        time,
        nonce,
        wallet_id: wallet.id,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        success_url: successUrl,
        cancel_url: cancelUrl,
        wallet_signature: signatureBase64,
    };

    // 5. Send request
    try {
        const response = await fetchWithTimeout(`${POWM_API_BASE}/wallets/start-identity-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            let errorBody;
            try {
                const text = await response.text();
                try {
                    errorBody = JSON.parse(text);
                } catch {
                    errorBody = { message: text || response.statusText };
                }
            } catch (e) {
                // If we can't read text (e.g. network error during read), use status text
                errorBody = { message: response.statusText };
            }

            if (response.status === 401) {
                throw new StartIdentityVerificationError('UNAUTHORIZED', `Authorization failed: ${JSON.stringify(errorBody)}`, response.status, errorBody);
            }

            throw new StartIdentityVerificationError('REQUEST_FAILED', `Server returned ${response.status}: ${JSON.stringify(errorBody)}`, response.status, errorBody);
        }

        const data = await response.json();

        // 6. Check response structure
        if (!data || typeof data.redirect_url !== 'string') {
            throw new StartIdentityVerificationError('INVALID_RESPONSE', 'Invalid response format from server', 200, data);
        }

        return data as StartIdentityVerificationResponse;
    } catch (error) {
        if (error instanceof StartIdentityVerificationError) {
            throw error;
        }
        throw new StartIdentityVerificationError('NETWORK_ERROR', error instanceof Error ? error.message : 'Unknown network error', 0, null, error instanceof Error ? error : undefined);
    }
}
