import { app, safeStorage } from "electron";
import * as fs from "fs";
import * as path from "path";

const KEY_FILE = path.join(app.getPath("userData"), "api-key.dat");

/**
 * Encrypts and stores the API key in a file under the user data directory.
 */
export function storeApiKey(key: string): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("SafeStorage encryption is not available.");
  }
  const encrypted = safeStorage.encryptString(key);
  fs.writeFileSync(KEY_FILE, encrypted);
}

/**
 * Retrieves and decrypts the stored API key, or returns null if not set.
 */
export function getApiKey(): string | null {
  if (!fs.existsSync(KEY_FILE)) {
    return null;
  }
  const encrypted = fs.readFileSync(KEY_FILE);
  const decrypted = safeStorage.decryptString(encrypted);
  return decrypted;
}
