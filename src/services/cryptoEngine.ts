/**
 * CipherVault Enterprise - Cryptographic Engine
 * Hybrid AES-256-GCM + SHA-256 Integrity Verification
 * Built on Web Cryptography API standards
 */

// Helper to convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to convert Base64 to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper to convert ArrayBuffer to Hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface EncryptionResult {
  ciphertextBase64: string;
  ivBase64: string;
  sha256Hash: string; // Plaintext checksum
  exportedKeyBase64: string; // Symmetric AES key (in real CP-ABE, this is wrapped under access tree)
  algorithm: string;
  keyLengthBits: number;
}

export interface DecryptionResult {
  plaintext: string;
  calculatedSha256: string;
  expectedSha256: string;
  integrityPassed: boolean;
  decryptionPassed: boolean;
  error?: string;
}

export class HybridCryptoEngine {
  /**
   * Generates a cryptographically strong random AES-256-GCM key
   */
  public static async generateAES256Key(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Calculates cryptographic SHA-256 hash of a string or ArrayBuffer
   */
  public static async calculateSHA256(data: ArrayBuffer | string): Promise<string> {
    let buffer: ArrayBuffer;
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(data).buffer;
    } else {
      buffer = data;
    }
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return bufferToHex(hashBuffer);
  }

  /**
   * Encrypts plaintext using AES-256-GCM with a 96-bit (12 byte) random IV
   * and computes SHA-256 checksum of original plaintext for post-decryption integrity verification.
   */
  public static async encrypt(
    plaintext: string | ArrayBuffer,
    customKey?: CryptoKey
  ): Promise<EncryptionResult> {
    const key = customKey || (await this.generateAES256Key());
    
    let plainBuffer: ArrayBuffer;
    if (typeof plaintext === 'string') {
      plainBuffer = new TextEncoder().encode(plaintext).buffer;
    } else {
      plainBuffer = plaintext;
    }

    // 1. Calculate SHA-256 Hash of plaintext
    const sha256Hash = await this.calculateSHA256(plainBuffer);

    // 2. Generate 12-byte initialization vector (IV) for GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 3. Perform AES-256-GCM encryption with 128-bit authentication tag
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      key,
      plainBuffer
    );

    // 4. Export the key to raw format (in CP-ABE this is encapsulated into the ciphertext policy tree)
    const rawKey = await window.crypto.subtle.exportKey('raw', key);

    return {
      ciphertextBase64: bufferToBase64(encryptedBuffer),
      ivBase64: bufferToBase64(iv.buffer),
      sha256Hash,
      exportedKeyBase64: bufferToBase64(rawKey),
      algorithm: 'AES-256-GCM',
      keyLengthBits: 256,
    };
  }

  /**
   * Decrypts ciphertext using AES-256-GCM and verifies SHA-256 digest
   */
  public static async decrypt(
    ciphertextBase64: string,
    ivBase64: string,
    exportedKeyBase64: string,
    expectedSha256: string
  ): Promise<DecryptionResult> {
    try {
      const keyBuffer = base64ToBuffer(exportedKeyBase64);
      const ivBuffer = base64ToBuffer(ivBase64);
      const cipherBuffer = base64ToBuffer(ciphertextBase64);

      // Import the AES key
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt using AES-256-GCM
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(ivBuffer),
          tagLength: 128,
        },
        key,
        cipherBuffer
      );

      const plaintext = new TextDecoder().decode(decryptedBuffer);

      // Verify SHA-256 Integrity
      const calculatedSha256 = await this.calculateSHA256(decryptedBuffer);
      const integrityPassed = calculatedSha256.toLowerCase() === expectedSha256.toLowerCase();

      return {
        plaintext,
        calculatedSha256,
        expectedSha256,
        integrityPassed,
        decryptionPassed: true,
      };
    } catch (err: any) {
      return {
        plaintext: '',
        calculatedSha256: '',
        expectedSha256,
        integrityPassed: false,
        decryptionPassed: false,
        error: err.message || 'AES-GCM Authentication tag verification failed or key is corrupt',
      };
    }
  }

  /**
   * Tamper simulation utility:
   * Flips a byte in ciphertext base64 to simulate MITM or cloud storage corruption
   */
  public static simulateTampering(ciphertextBase64: string): string {
    const buffer = new Uint8Array(base64ToBuffer(ciphertextBase64));
    if (buffer.length > 5) {
      buffer[buffer.length - 3] = buffer[buffer.length - 3] ^ 0xff; // Invert byte
    }
    return bufferToBase64(buffer.buffer);
  }
}
