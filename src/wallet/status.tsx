import { checkWalletStatus } from '@/sdk-extension';
import { ReactNode, createContext, useContext, useState } from 'react';
import { getCurrentWallet } from './service';

/**
 * Ephemeral Wallet Status
 * This state is NOT saved to disk and resets on app restart.
 */

export interface WalletStatus {
    lastChecked: Date | null;
    isVerified: boolean;
    isRevoked: boolean;
    identityVerification: 'not_started' | 'processing' | 'rejected' | 'accepted_awaiting_consumption' | 'completed';
    statusMessage: string | null;
}

interface WalletStatusContextType {
    status: WalletStatus;
    isLoading: boolean;
    refreshWalletStatus: () => Promise<WalletStatus | undefined>;
}

const defaultStatus: WalletStatus = {
    lastChecked: null,
    isVerified: false,
    isRevoked: false,
    identityVerification: 'not_started',
    statusMessage: null,
};

const WalletStatusContext = createContext<WalletStatusContextType>({
    status: defaultStatus,
    isLoading: false,
    refreshWalletStatus: async () => undefined,
});

export const useWalletStatus = () => useContext(WalletStatusContext);

export const WalletStatusProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<WalletStatus>(defaultStatus);
    const [isLoading, setIsLoading] = useState(false);

    const refreshWalletStatus = async () => {
        setIsLoading(true);
        try {
            const wallet = getCurrentWallet();
            // If no wallet is loaded yet, we can't really check status against a server for a specific ID
            // But validation loops might start before wallet load in some archs. 
            // Here we assume wallet is loaded or we skip.

            if (!wallet) {
                console.warn('[WalletStatus] No wallet loaded, skipping status check');
                setIsLoading(false);
                return undefined;
            }

            console.log(`[WalletStatus] Checking status for wallet ${wallet.id}...`);

            const result = await checkWalletStatus(wallet);
            console.log('[WalletStatus] Result:', JSON.stringify(result, null, 2));

            const newStatus: WalletStatus = {
                lastChecked: new Date(),
                isVerified: result.verified,
                isRevoked: false,
                identityVerification: result.identity_verification,
                statusMessage: result.verified ? 'Verified' : 'Not Verified'
            };

            setStatus(newStatus);
            return newStatus;

        } catch (error) {
            console.error('[WalletStatus] Failed to refresh status', error);
            // Don't revoke on error, just log it. Maybe set message.
            setStatus(prev => ({ ...prev, statusMessage: 'Status Check Failed', lastChecked: new Date() }));

            // Re-throw so callers (like startup) can handle the failure (e.g. block access)
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WalletStatusContext.Provider value={{ status, isLoading, refreshWalletStatus }}>
            {children}
        </WalletStatusContext.Provider>
    );
};
