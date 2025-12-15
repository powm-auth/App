import { HistoryItem } from '@/history/types';
import { gcm } from '@noble/ciphers/aes';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import { File, Paths } from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

const HISTORY_FILE = new File(Paths.document, 'history_data.enc');
const ENCRYPTION_KEY_STORAGE_KEY = 'powm_wallet_encryption_key'; // Reuse the same key for simplicity

/**
 * Get the encryption key (reusing the wallet one)
 */
async function getEncryptionKey(): Promise<string> {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE_KEY);
    if (!key) {
        // Should already exist if wallet exists, but just in case
        const keyBytes = Crypto.getRandomBytes(32);
        key = Buffer.from(keyBytes).toString('base64');
        await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE_KEY, key);
    }
    return key;
}

/**
 * Encrypt data using AES-256-GCM
 */
async function encryptData(data: string, keyBase64: string): Promise<string> {
    const key = Buffer.from(keyBase64, 'base64');
    const nonce = Crypto.getRandomBytes(12);

    const cipher = gcm(key, nonce);
    const plaintext = Buffer.from(data, 'utf8');

    const result = cipher.encrypt(plaintext);

    // Return nonce + ciphertext + tag as base64
    const combined = Buffer.concat([Buffer.from(nonce), Buffer.from(result)]);
    return combined.toString('base64');
}

/**
 * Decrypt data using AES-256-GCM
 */
async function decryptData(encryptedBase64: string, keyBase64: string): Promise<string> {
    const key = Buffer.from(keyBase64, 'base64');
    const combined = Buffer.from(encryptedBase64, 'base64');

    // Extract nonce (first 12 bytes)
    const nonce = combined.subarray(0, 12);
    // The rest is ciphertext || tag
    const ciphertextWithTag = combined.subarray(12);

    const cipher = gcm(key, nonce);
    const decrypted = cipher.decrypt(ciphertextWithTag);

    return Buffer.from(decrypted).toString('utf8');
}

/**
 * Load history items from encrypted storage
 */
export async function loadHistory(): Promise<HistoryItem[]> {
    try {
        if (!HISTORY_FILE.exists) {
            return [];
        }

        const encryptedContent = await HISTORY_FILE.text();
        const encryptionKey = await getEncryptionKey();

        const decryptedJson = await decryptData(encryptedContent, encryptionKey);
        const rawItems: any[] = JSON.parse(decryptedJson);

        // Convert string dates back to Date objects
        return rawItems.map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort newest first

    } catch (error) {
        console.error('Error loading history:', error);
        return [];
    }
}

/**
 * Add a new item to history
 */
export async function addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> {
    try {
        const currentHistory = await loadHistory();

        const newItem: HistoryItem = {
            ...item,
            id: Crypto.randomUUID(),
            timestamp: new Date()
        };

        // Limit history to last 100 items
        const updatedHistory = [newItem, ...currentHistory].slice(0, 100);

        const encryptionKey = await getEncryptionKey();
        const encryptedContent = await encryptData(JSON.stringify(updatedHistory), encryptionKey);

        if (HISTORY_FILE.exists) {
            await HISTORY_FILE.delete();
        }
        await HISTORY_FILE.create();
        await HISTORY_FILE.write(encryptedContent);

    } catch (error) {
        console.error('Error adding history item:', error);
    }
}

/**
 * Delete a single history item by ID
 */
export async function deleteHistoryItem(id: string): Promise<void> {
    try {
        const currentHistory = await loadHistory();
        const updatedHistory = currentHistory.filter(item => item.id !== id);

        const encryptionKey = await getEncryptionKey();
        const encryptedContent = await encryptData(JSON.stringify(updatedHistory), encryptionKey);

        if (HISTORY_FILE.exists) {
            await HISTORY_FILE.delete();
        }
        await HISTORY_FILE.create();
        await HISTORY_FILE.write(encryptedContent);
    } catch (error) {
        console.error('Error deleting history item:', error);
    }
}

/**
 * Clear all history
 */
export async function clearHistory(): Promise<void> {
    try {
        if (HISTORY_FILE.exists) {
            await HISTORY_FILE.delete();
        }
    } catch (error) {
        console.error('Error clearing history:', error);
    }
}
