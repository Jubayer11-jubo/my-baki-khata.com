# আমার বাকি খাতা (My Baki Khat)

> **কোথায় কত বাকি—হিসাব থাকুক আপনার হাতেই।**  
> *Personal Customer Debt & Credit Tracker — 100% Offline-First Progressive Web App (PWA)*

---

## 📌 ওভারভিউ (Overview)

**"আমার বাকি খাতা"** হলো গ্রাহকদের জন্য তৈরি একটি ব্যক্তিগত বাকি হিসাব রাখার অ্যাপ্লিকেশন। এটি দোকানদারদের জন্য অ্যাকাউন্টিং সফটওয়্যার নয়; বরং আপনি নিজে বিভিন্ন দোকান (যেমন: মুদি দোকান, ফার্মেসি, কাঁচাবাজার, কাপড়ের দোকান) থেকে যে সমস্ত পণ্য বাকিতে ক্রয় করেন এবং পরবর্তীতে যা পরিশোধ করেন—তার নিখুঁত খতিয়ান নিজের মুঠোফোনে নিরাপদে সংরক্ষণ করার জন্য ডিজাইন করা হয়েছে।

অ্যাপটি সম্পূর্ণ **অফলাইন-ফার্স্ট**। আপনার ফোনের ব্রাউজারের নিজস্ব **IndexedDB (Dexie.js)** ডাটাবেসে সমস্ত তথ্য অত্যন্ত দ্রুত সংরক্ষিত থাকে। ইন্টারনেটের কোনো প্রয়োজন নেই এবং আপনার আর্থিক তথ্য কখনোই কোনো ক্লাউড সার্ভারে আপলোড হয় না।

---

## ✨ প্রধান বৈশিষ্ট্যসমূহ (Key Features)

1. **সহজ হিসাবরক্ষণ (Simple Customer Ledger)**:
   - কোন দোকান থেকে কী পণ্য নেওয়া হয়েছে, তার তারিখ এবং বিস্তারিত খতিয়ান।
   - প্রতি কেনাকাটায় একাধিক পণ্য (চাল, ডাল, তেল ইত্যাদি) এবং তাদের একক, পরিমাণ ও মোট দাম হিসাব রাখা।

2. **ড্যাশবোর্ড ও সামারি কার্ডস (Dashboard Metrics)**:
   - **মোট বাকি**: বিভিন্ন দোকানে আপনার সর্বমোট কত টাকা বাকি রয়েছে।
   - **এই মাসে নিয়েছি**: চলতি মাসে মোট কত টাকার বাকি নিয়েছেন।
   - **এই মাসে পরিশোধ**: চলতি মাসে মোট কত টাকা দোকানদারকে পরিশোধ করেছেন।

3. **দোকান ব্যবস্থাপনা (Shop Management)**:
   - নাম, ধরন, মোবাইল নম্বর, ঠিকানা ও নোটসহ দোকান যোগ ও এডিট।
   - প্রতিটি দোকানের জন্য আলাদা ব্যালেন্স ও লেনদেনের ইতিহাস।

4. **টাকা পরিশোধ (Payment Tracking)**:
   - নগদ (Cash), বিকাশ (bKash), নগদ (Nagad), ব্যাংক বা অন্য মাধ্যমে পরিশোধের রেকর্ড সংরক্ষণ।
   - স্বয়ংক্রিয়ভাবে দোকানের বাকি সমন্বয়।

5. **তাগিদ ও রিমাইন্ডার (Payment Reminders)**:
   - দোকানে বাকি টাকা পরিশোধের জন্য তারিখ অনুযায়ী রিমাইন্ডার তৈরি।
   - লোকাল ব্রাউজার নোটিফিকেশন সাপোর্ট।

6. **গ্লোবাল সার্চ ও ফিল্টারিং (Search & Filters)**:
   - পণ্যের নাম, দোকানের নাম, নোট বা টাকার অঙ্ক দিয়ে নিমিষে হিসাব অনুসন্ধান।
   - চলতি মাস, গত মাস বা কাস্টম তারিখ এবং বাকি/পরিশোধ অনুযায়ী ফিল্টারিং।

7. **বিশদ গ্রাফ ও রিপোর্ট (Visual Reports)**:
   - শেষ ৬ মাসের বাকি ও পরিশোধের মোবাইল-বান্ধব বার চার্ট।
   - দোকান অনুযায়ী খরচের শতাংশ ও প্রগ্রেস বার।
   - অফলাইনে এক ক্লিকে **CSV / Excel** ফাইল ডাউনলোড।

8. **নিরাপদ ব্যাকআপ ও রিস্টোর (Backup & Restore)**:
   - সম্পূর্ণ ডাটা এক ক্লিকে `.json` ফাইল হিসেবে এক্সপোর্ট।
   - যে কোনো সময় ব্যাকআপ ফাইল আপলোড করে ডাটা রিস্টোর করার সুবিধা।
   - ভুলবশত ডাটা ডিলিট হওয়া রোধে ডাবল কনফার্মেশন প্রটেকশন।

9. **প্রগ্রেসিভ ওয়েব অ্যাপ (PWA)**:
   - অ্যান্ড্রয়েড ও আইফোনে হোম স্ক্রিনে অ্যাপ আকারে সরাসরি ইনস্টলযোগ্য।
   - অফলাইন সার্ভিস ওয়ার্কার ক্যাশিং।
   - ডার্ক মোড (Dark Mode), লাইট মোড ও সিস্টেম থিম সাপোর্ট।

---

## 🛠️ ব্যবহৃত প্রযুক্তি (Technology Stack)

- **Frontend**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (using Dexie.js)
- **PWA Tooling**: vite-plugin-pwa, Service Worker, Web App Manifest
- **Icons**: Lucide React + Custom High-Resolution SVG/PNG Assets
- **Fonts**: Hind Siliguri, Noto Sans Bengali

---

## 📁 ফোল্ডার স্ট্রাকচার (Folder Structure)

```text
jubayer-baki-khata/
├── public/
│   ├── icons/
│   │   ├── icon.svg
│   │   ├── icon-72.png
│   │   ├── icon-96.png
│   │   ├── icon-128.png
│   │   ├── icon-144.png
│   │   ├── icon-152.png
│   │   ├── icon-192.png
│   │   ├── icon-384.png
│   │   ├── icon-512.png
│   │   └── icon-maskable-512.png
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   └── offline.html
├── scripts/
│   └── generate-icons.js
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── InstallPrompt.tsx
│   │   │   ├── OfflineBadge.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── Toast.tsx
│   │   ├── dashboard/
│   │   │   ├── QuickActions.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   └── TopBar.tsx
│   │   ├── reminders/
│   │   │   └── ReminderModal.tsx
│   │   ├── shops/
│   │   │   ├── ShopCard.tsx
│   │   │   └── ShopModal.tsx
│   │   └── transactions/
│   │       ├── CreditModal.tsx
│   │       ├── PaymentModal.tsx
│   │       └── TransactionDetailsModal.tsx
│   ├── constants/
│   │   └── index.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── database/
│   │   ├── db.ts
│   │   └── repositories/
│   │       ├── reminderRepository.ts
│   │       ├── settingsRepository.ts
│   │       ├── shopRepository.ts
│   │       └── transactionRepository.ts
│   ├── hooks/
│   │   ├── useOnlineStatus.ts
│   │   ├── usePWAInstall.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── RemindersPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SearchFilterPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── ShopLedgerPage.tsx
│   │   ├── ShopsPage.tsx
│   │   └── WelcomePage.tsx
│   ├── services/
│   │   ├── backupService.ts
│   │   ├── calculationService.ts
│   │   └── notificationService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 💻 ভিএস কোডে চালানোর নির্দেশিকা (VS Code Setup)

### ধাপ ১: Node.js ইনস্টল করুন
আপনার কম্পিউটারে Node.js (ভার্সন ১৮ বা তার বেশি) ইনস্টল না থাকলে [nodejs.org](https://nodejs.org) থেকে ইনস্টল করুন।

### ধাপ ২: প্রজেক্ট ওপেন করুন
GitHub থেকে রিপোজিটরি ক্লোন বা ডাউনলোড করে আনজিপ করুন এবং VS Code-এ ফোল্ডারটি ওপেন করুন:
```bash
code .
```

### ধাপ ৩: টার্মিনাল ওপেন করুন
VS Code-এ `Ctrl + ` ` (বা `Terminal -> New Terminal`) দিয়ে টার্মিনাল খুলুন।

### ধাপ ৪: ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

### ধাপ ৫: লোকাল ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
npm run dev
```

### ধাপ ৬: ব্রাউজারে অ্যাপটি দেখুন
টার্মিনালে দেওয়া লোকাল লিঙ্কটি ওপেন করুন (সাধারণত `http://localhost:3000` অথবা `http://localhost:5173`)।

### ধাপ ৭: প্রোডাকশন বিল্ড তৈরি করুন
```bash
npm run build
```

### ধাপ ৮: প্রোডাকশন বিল্ড প্রিভিউ করুন
```bash
npm run preview
```

---

## 📱 PWA ইনস্টলেশন ও টেস্টিং (PWA Testing)

1. ব্রাউজারে অ্যাপটি চালু করলে স্ক্রিনের উপরে বা সেটিংসে **"অ্যাপটি ফোনে ইনস্টল করুন"** প্রম্পট দেখতে পাবেন।
2. **ইনস্টল করুন** বাটনে চাপ দিলে এটি আপনার অপারেটিং সিস্টেম বা ডিভাইসের হোম স্ক্রিনে অ্যাপ্লিকেশন আইকন হিসেবে যুক্ত হবে।
3. ক্রোম ডেভটুলস (`F12 -> Application -> Service Workers / Manifest`) দিয়ে PWA স্ট্যাটাস ও অফলাইন ক্যাশিং নিরীক্ষা করতে পারেন।
4. ইন্টারনেট সংযোগ বন্ধ করে (Network -> Offline) পেজ রিফ্রেশ করলেও অ্যাপটি অবিকল কাজ করবে।

---

## 🔄 ব্যাকআপ ও রিস্টোর করার নিয়ম (Backup & Restore)

1. অ্যাপের নিচের নেভিগেশন বার থেকে **⚙️ সেটিংস**-এ যান।
2. **ডাটা ব্যাকআপ নিন (JSON)** চাপুন। আপনার বর্তমান সমস্ত হিসাব একটি নিরাপদ `.json` ফাইল আকারে ডিভাইসে ডাউনলোড হবে।
3. অন্য কোনো ফোনে বা ব্রাউজারে ডাটা নিয়ে যেতে **ডাটা রিস্টোর করুন (JSON)** চেপে পূর্বের ফাইলটি নির্বাচন করুন।

---

## 🚀 ভবিষ্যৎ অ্যান্ড্রয়েড APK প্রস্তুতি (Capacitor Readiness)

প্রজেক্টটি এমন ক্লিন আর্কিটেকচারে তৈরি করা হয়েছে যাতে ভবিষ্যতে Capacitor দিয়ে সরাসরি অ্যান্ড্রয়েড `.apk` বা গুগল প্লে-স্টোর উপযোগী বান্ডেলে রূপান্তর করা যায়:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "আমার বাকি খাতা" "com.jubayer.bakikhata"
npm run build
npx cap add android
npx cap sync
npx cap open android
```

---

## 🔒 ডেটা নিরাপত্তা ও গোপনীয়তা (Privacy & Security)

- সমস্ত আর্থিক হিসাব শুধুমাত্র আপনার ব্যক্তিগত ডিভাইসের ব্রাউজার ডাটাবেসেই সীমাবদ্ধ।
- কোনো অ্যানালিটিক্স বা ট্র্যাকিং স্ক্রিপ্ট অন্তর্ভুক্ত নেই।
- ব্যাকআপ ফাইল পাসওয়ার্ড বা ক্লাউডে আপলোড ছাড়া সম্পূর্ণ অফলাইনে আদান-প্রদানযোগ্য।

---

© ২০২৬ **আমার বাকি খাতা (My Baki Khat)** — কোথায় কত বাকি—হিসাব থাকুক আপনার হাতেই।
