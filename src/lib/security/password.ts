import crypto from "crypto";

/**
 * Enterprise Cryptographic Password Service
 * - Algorithm: Scrypt (Memory-hard key derivation function recommended by OWASP)
 * - Salt: 16 bytes Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
 * - Key Length: 64 bytes
 * - Memory cost (N): 16384, Block size (r): 8, Parallelization (p): 1
 * - Verification: Constant-Time Comparison via crypto.timingSafeEqual (Anti-Timing Attack)
 */

const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keyLen: 64,
};

/**
 * Hash a plaintext password with a unique cryptographic salt.
 * Output format: `<salt_hex>:<hash_hex>`
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(
      password,
      salt,
      SCRYPT_PARAMS.keyLen,
      { N: SCRYPT_PARAMS.N, r: SCRYPT_PARAMS.r, p: SCRYPT_PARAMS.p },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString("hex")}`);
      }
    );
  });
}

/**
 * Verify a plaintext password against a stored `<salt_hex>:<hash_hex>` string.
 * Uses crypto.timingSafeEqual to prevent side-channel timing analysis.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHash: string
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split(":");
      if (parts.length !== 2) return resolve(false);

      const [salt, originalHashHex] = parts;
      const originalKeyBuffer = Buffer.from(originalHashHex, "hex");

      crypto.scrypt(
        plainPassword,
        salt,
        SCRYPT_PARAMS.keyLen,
        { N: SCRYPT_PARAMS.N, r: SCRYPT_PARAMS.r, p: SCRYPT_PARAMS.p },
        (err, derivedKey) => {
          if (err) return resolve(false);

          if (derivedKey.length !== originalKeyBuffer.length) {
            return resolve(false);
          }

          const isMatch = crypto.timingSafeEqual(derivedKey, originalKeyBuffer);
          resolve(isMatch);
        }
      );
    } catch {
      resolve(false);
    }
  });
}

/**
 * Validate password strength according to NIST / OWASP guidelines:
 * - Minimum 8 characters (max 100)
 * - At least one uppercase letter [A-Z]
 * - At least one lowercase letter [a-z]
 * - At least one digit [0-9]
 * - At least one special symbol [!@#$%^&*(),.?":{}|<>]
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Kata sandi wajib diisi." };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Kata sandi minimal terdiri dari 8 karakter.",
    };
  }

  if (password.length > 100) {
    return {
      isValid: false,
      message: "Kata sandi maksimal 100 karakter.",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Kata sandi harus memuat setidaknya 1 huruf besar (A-Z).",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Kata sandi harus memuat setidaknya 1 huruf kecil (a-z).",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Kata sandi harus memuat setidaknya 1 angka (0-9).",
    };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message:
        "Kata sandi harus memuat setidaknya 1 karakter khusus / simbol (@, #, $, dll).",
    };
  }

  // Blacklist extremely common weak passwords
  const commonWeak = [
    "password",
    "password123",
    "12345678",
    "qwerty123",
    "admin123",
  ];
  if (commonWeak.includes(password.toLowerCase())) {
    return {
      isValid: false,
      message: "Kata sandi terlalu umum dan mudah ditebak. Buat yang lebih unik.",
    };
  }

  return { isValid: true };
}
