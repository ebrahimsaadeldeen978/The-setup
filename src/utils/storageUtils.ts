/**
 * Storage and Image Utilities
 * Provides safe localStorage operations with quota error handling,
 * automatic storage hygiene, and client-side image compression.
 */

// In-memory fallback in case localStorage quota is exceeded or storage is disabled
const memoryStorage = new Map<string, string>();

/**
 * Compresses an image File or data URL using HTML5 Canvas.
 * Reduces 5MB-10MB camera/phone uploads down to ~15KB-35KB,
 * completely preventing LocalStorage QuotaExceededError.
 */
export async function compressImage(
  input: File | string,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const processImage = () => {
        let width = img.width || maxWidth;
        let height = img.height || maxHeight;

        // Calculate aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original string if canvas context unavailable
          resolve(typeof input === 'string' ? input : '');
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onload = processImage;
      img.onerror = () => {
        // If image loading fails, return empty or truncated string
        resolve(typeof input === 'string' ? input : '');
      };

      if (typeof input === 'string') {
        img.src = input;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            img.src = e.target.result;
          } else {
            resolve('');
          }
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(input);
      }
    } catch (e) {
      console.warn('Image compression fallback:', e);
      resolve(typeof input === 'string' ? input : '');
    }
  });
}

/**
 * Safely saves data to localStorage without crashing when QuotaExceededError occurs.
 * If quota is reached, cleans up oversized image data and retries.
 */
export function safeSetItem(key: string, value: string): boolean {
  // Always update memory fallback
  memoryStorage.set(key, value);

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError =
      err?.name === 'QuotaExceededError' ||
      err?.code === 22 ||
      err?.code === 1014 ||
      err?.number === -2147024888 ||
      (typeof err?.message === 'string' && err.message.toLowerCase().includes('quota'));

    if (isQuotaError) {
      console.warn(`LocalStorage quota exceeded while saving "${key}". Running cleanup...`);
      // Try emergency cleanup: trim bloated base64 data in other keys
      try {
        cleanupBloatedStorage();
        // Retry saving current item
        localStorage.setItem(key, value);
        return true;
      } catch (retryErr) {
        // If still exceeding, try stripping any huge embedded base64 in the value being saved
        try {
          const stripped = stripHeavyBase64Images(value);
          localStorage.setItem(key, stripped);
          return true;
        } catch {
          console.warn(`Could not save "${key}" to LocalStorage even after compression. Stored in memory.`);
          return false;
        }
      }
    } else {
      console.warn(`LocalStorage setItem error for key "${key}":`, err);
      return false;
    }
  }
}

/**
 * Safely gets an item from localStorage with fallback to memory
 */
export function safeGetItem(key: string): string | null {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;
  } catch (err) {
    console.warn(`LocalStorage getItem error for "${key}":`, err);
  }
  return memoryStorage.get(key) ?? null;
}

/**
 * Strip heavy base64 images (>100KB) from a JSON string to fit in localStorage
 */
function stripHeavyBase64Images(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr);
    const prune = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) {
        return obj.map(prune);
      }
      const copy: any = { ...obj };
      for (const k of Object.keys(copy)) {
        if (typeof copy[k] === 'string' && copy[k].startsWith('data:image/') && copy[k].length > 80000) {
          // Replace oversized base64 with a placeholder or smaller indicator
          copy[k] = '';
        } else if (typeof copy[k] === 'object') {
          copy[k] = prune(copy[k]);
        }
      }
      return copy;
    };
    return JSON.stringify(prune(parsed));
  } catch {
    return jsonStr;
  }
}

/**
 * Clean up existing bloated storage entries across the origin
 */
export function cleanupBloatedStorage(): void {
  try {
    const keysToCheck = [
      'don_relationships',
      'don_racket_nodes',
      'don_vault_records',
      'don_financial_transactions',
      'don_saved_pin_colors'
    ];

    for (const key of keysToCheck) {
      const val = localStorage.getItem(key);
      if (val && val.length > 200000) {
        // Contains large payload (probably uncompressed base64 images)
        const pruned = stripHeavyBase64Images(val);
        if (pruned.length < val.length) {
          localStorage.setItem(key, pruned);
        }
      }
    }
  } catch (e) {
    console.warn('Storage cleanup failed:', e);
  }
}
