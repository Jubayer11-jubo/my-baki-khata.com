export const APP_NAME_BN = 'আমার বাকি খাতা';
export const APP_NAME_EN = 'My Baki Khat';
export const APP_TAGLINE = 'কোথায় কত বাকি—হিসাব থাকুক আপনার হাতেই।';
export const APP_VERSION = '1.0.0';

export const COMMON_SHOP_TYPES = [
  'মুদি দোকান',
  'ফার্মেসি / ওষুধের দোকান',
  'কাঁচাবাজার / সবজি দোকান',
  'মাছ-মাংসের দোকান',
  'কাপড়ের দোকান',
  'হোটেল / রেস্টুরেন্ট',
  'চা / মিষ্টির দোকান',
  'হার্ডওয়্যার ও ইলেকট্রিক',
  'স্টেশনারি ও বই',
  'সেলুন / লন্ড্রি',
  'অন্যান্য'
];

export const COMMON_UNITS = [
  'কেজি',
  'গ্রাম',
  'লিটার',
  'পিস',
  'প্যাকেট',
  'ডজন',
  'হালি',
  'বস্তা',
  'মিটার',
  'বক্স',
  'প্লেট'
];

export const PAYMENT_METHODS = [
  { id: 'CASH', label: 'নগদ (Cash)' },
  { id: 'BKASH', label: 'বিকাশ (bKash)' },
  { id: 'NAGAD', label: 'নগদ (Nagad)' },
  { id: 'BANK', label: 'ব্যাংক (Bank)' },
  { id: 'OTHER', label: 'অন্যান্য (Other)' }
] as const;

export const TRANSACTION_TYPES = {
  CREDIT: {
    label: 'বাকি নেওয়া',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    sign: '+'
  },
  PAYMENT: {
    label: 'পরিশোধ',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    sign: '-'
  },
  ADJUSTMENT: {
    label: 'সমন্বয় / ছাড়',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    sign: '±'
  }
} as const;
