// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Russian format)
export function isValidPhone(phone: string): boolean {
  // Allow +7, 8, or 7 prefix with 10 digits
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+7|8|7)?[0-9]{10}$/;
  return phoneRegex.test(cleanPhone);
}

// Normalize phone number to +7 format
export function normalizePhone(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  if (cleanPhone.startsWith('+7')) {
    return cleanPhone;
  }

  if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
    return '+7' + cleanPhone.slice(1);
  }

  if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    return '+' + cleanPhone;
  }

  if (cleanPhone.length === 10) {
    return '+7' + cleanPhone;
  }

  return cleanPhone;
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// INN validation (Russian tax ID)
export function isValidINN(inn: string): boolean {
  if (!/^\d{10}$|^\d{12}$/.test(inn)) {
    return false;
  }

  const checkDigit = (inn: string, coefficients: number[]): number => {
    let sum = 0;
    for (let i = 0; i < coefficients.length; i++) {
      sum += parseInt(inn[i], 10) * coefficients[i];
    }
    return (sum % 11) % 10;
  };

  if (inn.length === 10) {
    const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    return checkDigit(inn, coefficients) === parseInt(inn[9], 10);
  }

  if (inn.length === 12) {
    const coefficients1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const coefficients2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

    return (
      checkDigit(inn, coefficients1) === parseInt(inn[10], 10) &&
      checkDigit(inn, coefficients2) === parseInt(inn[11], 10)
    );
  }

  return false;
}

// BIK validation (Russian bank code)
export function isValidBIK(bik: string): boolean {
  return /^\d{9}$/.test(bik);
}

// Bank account validation (Russian format)
export function isValidBankAccount(account: string): boolean {
  return /^\d{20}$/.test(account);
}

// Card number validation (Luhn algorithm)
export function isValidCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');

  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Get card brand from number
export function getCardBrand(cardNumber: string): string | null {
  const cleaned = cardNumber.replace(/\s/g, '');

  const patterns: [RegExp, string][] = [
    [/^4[0-9]{12}(?:[0-9]{3})?$/, 'visa'],
    [/^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/, 'mastercard'],
    [/^3[47][0-9]{13}$/, 'amex'],
    [/^2200[0-9]{12}$|^220[1-4][0-9]{12}$/, 'mir'],
    [/^6(?:011|5[0-9]{2})[0-9]{12}$/, 'discover'],
    [/^(?:2131|1800|35\d{3})\d{11}$/, 'jcb'],
    [/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, 'diners'],
    [/^62[0-9]{14,17}$/, 'unionpay'],
  ];

  for (const [pattern, brand] of patterns) {
    if (pattern.test(cleaned)) {
      return brand;
    }
  }

  return null;
}

// Mask card number for display
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 8) {
    return cardNumber;
  }
  const first4 = cleaned.slice(0, 4);
  const last4 = cleaned.slice(-4);
  return `${first4} •••• •••• ${last4}`;
}

// Password strength validation
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (errors.length === 0) {
    if (password.length >= 12 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}
