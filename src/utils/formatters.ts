const BANGLA_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯'
};

const BANGLA_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

/**
 * Converts English digits in a string/number to Bengali digits
 */
export function toBanglaNumber(value: number | string): string {
  const str = String(value);
  return str.replace(/[0-9]/g, match => BANGLA_DIGITS[match] || match);
}

/**
 * Formats a monetary amount into Bangladeshi Taka string (e.g. "৳ 1,250" or "৳ 1,250.50")
 * Uses safe rounding and avoids trailing zeroes when exact.
 */
export function formatTaka(amount: number, useBanglaDigits = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '৳ 0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with thousands separator
  const hasDecimals = absAmount % 1 !== 0;
  const formattedNumber = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  });

  const displayNum = useBanglaDigits ? toBanglaNumber(formattedNumber) : formattedNumber;
  return `${isNegative ? '-' : ''}৳ ${displayNum}`;
}

/**
 * Format date string (YYYY-MM-DD) into Bengali readable date: e.g. "২৫ সেপ্টেম্বর ২০২৬"
 */
export function formatDateBangla(dateStr: string, useBanglaDigits = false): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const monthName = BANGLA_MONTHS[monthIndex] || parts[1];
      const dayStr = useBanglaDigits ? toBanglaNumber(day) : String(day);
      const yearStr = useBanglaDigits ? toBanglaNumber(year) : year;

      return `${dayStr} ${monthName} ${yearStr}`;
    }

    const d = new Date(dateStr);
    const day = d.getDate();
    const month = BANGLA_MONTHS[d.getMonth()];
    const year = d.getFullYear();

    const dayStr = useBanglaDigits ? toBanglaNumber(day) : String(day);
    const yearStr = useBanglaDigits ? toBanglaNumber(year) : String(year);

    return `${dayStr} ${month} ${yearStr}`;
  } catch {
    return dateStr;
  }
}

/**
 * Format time from ISO string: e.g. "08:30 PM"
 */
export function formatTimeBangla(isoStr: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const minStr = minutes < 10 ? '0' + minutes : String(minutes);
    const hrStr = hours < 10 ? '0' + hours : String(hours);
    return `${hrStr}:${minStr} ${ampm}`;
  } catch {
    return '';
  }
}

/**
 * Get today's local date as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
