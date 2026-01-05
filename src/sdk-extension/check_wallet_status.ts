import { withSigningKey } from '@/wallet/storage';
import { signing } from '@powm/sdk-js/crypto';
import * as Crypto from 'expo-crypto';
import { POWM_API_BASE } from './constants';
import { CheckWalletStatusError, Wallet, WalletStatusRequest, WalletStatusResponse } from './structs';
import { fetchWithTimeout, uint8ArrayToBase64, utf8ToUint8Array } from './utils';

const { sign } = signing;

/**
 * Check the status of a wallet against the Powm API.
 * 
 * @param wallet The wallet to check
 * @returns The wallet status response
 */
export async function checkWalletStatus(wallet: Wallet): Promise<WalletStatusResponse> {
    // Server expects time format without milliseconds: yyyy-MM-ddTHH:mm:ssZ
    // We strip milliseconds from ISO string to match server's signature expectation
    const time = new Date().toISOString().split('.')[0] + 'Z';
    const nonce = Crypto.randomUUID().replace(/-/g, ''); // Simple nonce

    // Construct the signing string deterministic format:
    // v1/wallets/status|time|nonce|wallet_id|
    // Ensure the endpoint path matches exactly what the server expects in ToSigningString()
    const endpointPath = 'v1/wallets/status';
    const signingString = `${endpointPath}|${time}|${nonce}|${wallet.id}|`;

    let signatureBase64 = '';

    // Sign the request using the wallet's private key
    try {
        signatureBase64 = await withSigningKey(async (privateKey: Buffer) => {
            const signatureBytes = await sign(
                wallet.signing_algorithm,
                privateKey,
                utf8ToUint8Array(signingString)
            );
            return uint8ArrayToBase64(signatureBytes);
        });
    } catch (error: any) {
        throw new CheckWalletStatusError(
            'INVALID_SIGNATURE',
            `Failed to sign wallet status request: ${error.message}`,
            undefined,
            undefined,
            error
        );
    }

    const requestBody: WalletStatusRequest = {
        time,
        nonce,
        wallet_id: wallet.id,
        wallet_signature: signatureBase64
    };

    // Make the API request
    try {
        const url = `${POWM_API_BASE}/wallets/status`;

        const response = await fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorBody;
            try {
                const text = await response.text();
                try {
                    errorBody = JSON.parse(text);
                } catch {
                    errorBody = text;
                }
            } catch {
                errorBody = 'Could not read response body';
            }

            throw new CheckWalletStatusError(
                'REQUEST_FAILED',
                `Wallet status check failed with status ${response.status}`,
                response.status,
                errorBody
            );
        }

        const responseData = await response.json();
        return responseData as WalletStatusResponse;

    } catch (error: any) {
        if (error instanceof CheckWalletStatusError) {
            throw error;
        }

        throw new CheckWalletStatusError(
            'NETWORK_ERROR',
            `Network error checking wallet status: ${error.message}`,
            undefined,
            undefined,
            error
        );
    }
}
