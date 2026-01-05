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
    statusMessage: string | null;
}

interface WalletStatusContextType {
    status: WalletStatus;
    isLoading: boolean;
    refreshWalletStatus: () => Promise<void>;
}

const defaultStatus: WalletStatus = {
    lastChecked: null,
    isVerified: false,
    isRevoked: false,
    statusMessage: null,
};

const WalletStatusContext = createContext<WalletStatusContextType>({
    status: defaultStatus,
    isLoading: false,
    refreshWalletStatus: async () => { },
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
                return;
            }

            console.log(`[WalletStatus] Checking status for wallet ${wallet.id}...`);

            const result = await checkWalletStatus(wallet);
            console.log('[WalletStatus] Result:', JSON.stringify(result, null, 2));

            setStatus({
                lastChecked: new Date(),
                isVerified: result.verified,
                isRevoked: false, // API doesn't return revoked status yet, it throws Unauthorized if sig is valid but revoked logic might be different
                statusMessage: result.verified ? 'Verified' : 'Not Verified'
            });

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
