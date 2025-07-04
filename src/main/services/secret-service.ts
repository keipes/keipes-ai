import { app, safeStorage } from "electron";
import * as fs from "fs";
import * as path from "path";
import logger from "./logger";

/**
 * Generates the file path for storing the API key of a specific provider.
 */
function getKeyFile(provider: string): string {
  return path.join(app.getPath("userData"), `api-key-${provider}.dat`);
}

/**
 * Encrypts and stores the API key for a provider.
 */
export function storeApiKey(provider: string, key: string): void {
  logger.info(`Storing API key for provider: ${provider}`);
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("SafeStorage encryption is not available.");
  }
  const encrypted = safeStorage.encryptString(key);
  fs.writeFileSync(getKeyFile(provider), encrypted);
}

/**
 * Retrieves and decrypts the stored API key for a provider, or returns null if not set.
 */
export function getApiKey(provider: string): string | null {
  logger.info(`Retrieving API key for provider: ${provider}`);
  const file = getKeyFile(provider);
  if (!fs.existsSync(file)) {
    return null;
  }
  const encrypted = fs.readFileSync(file);
  if (!safeStorage.isEncryptionAvailable()) {
    console.error("SafeStorage decryption not available.");
    return null;
  }
  try {
    const decrypted = safeStorage.decryptString(encrypted);
    logger.info(
      `Successfully decrypted API key for provider: ${provider} ${decrypted}`
    );
    return decrypted;
  } catch (error) {
    console.error(
      `Failed to decrypt API key for provider '${provider}':`,
      error
    );
    // Clear the corrupted file so user can re-enter the key
    try {
      fs.unlinkSync(file);
      console.log(`Cleared corrupted API key file for provider '${provider}'`);
    } catch (deleteError) {
      console.error(`Failed to delete corrupted key file:`, deleteError);
    }
    return null;
  }
}

/**
 * Clears the stored API key for a provider.
 */
export function clearApiKey(provider: string): boolean {
  const file = getKeyFile(provider);
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Cleared API key for provider '${provider}'`);
      return true;
    } catch (error) {
      console.error(
        `Failed to clear API key for provider '${provider}':`,
        error
      );
      return false;
    }
  }
  return true;
}
