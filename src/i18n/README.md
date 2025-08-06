# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization support with 5 languages:
- English (en)
- Spanish (es) 
- French (fr)
- Italian (it)
- Kiswahili (sw)

## How to Use Translations

### 1. In React Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('common.welcome')}</p>
      <button onClick={() => i18n.changeLanguage('es')}>
        Change to Spanish
      </button>
    </div>
  );
};
```

### 2. Available Translation Keys

#### Navigation
- `nav.home` - Home
- `nav.shop` - Shop  
- `nav.crafts` - Our Crafts
- `nav.stories` - Stories
- `nav.gifts` - Gift Ideas
- `nav.sustainability` - Sustainability
- `nav.csr` - CSR
- `nav.about` - About
- `nav.contact` - Contact
- `nav.cart` - Cart
- `nav.signin` - Sign in / Register
- `nav.account` - Account
- `nav.welcome` - Welcome
- `nav.searchPlaceholder` - Search placeholder text

#### Common
- `common.loading` - Loading...
- `common.error` - Error
- `common.tryAgain` - Try Again
- `common.readMore` - Read More
- `common.learnMore` - Learn More
- `common.viewAll` - View All
- `common.shopNow` - Shop Now
- `common.addToCart` - Add to Cart
- `common.buyNow` - Buy Now
- `common.contactUs` - Contact Us
- `common.language` - Language
- `common.allCategories` - All Categories

#### User Menu
- `user.profile` - Profile
- `user.signOut` - Sign Out
- `user.myOrders` - My Orders
- `user.myCoins` - My Coins
- `user.messageCenter` - Message Center
- `user.payment` - Payment
- `user.wishList` - Wish List
- `user.myCoupons` - My Coupons
- `user.settings` - Settings
- `user.sellerLogin` - Seller Log In
- `user.returnPolicy` - Return & Refund Policy
- `user.disputes` - Disputes & Reports
- `user.signIn` - Sign in
- `user.register` - Register

#### Pages
- `pages.stories.title` - Artisan Stories
- `pages.stories.subtitle` - Page subtitle
- `pages.contact.title` - Contact Us
- `pages.contact.fullName` - Full Name
- etc.

### 3. Adding New Translations

1. Add the key-value pair to all language files in `src/i18n/locales/`
2. Use the translation key in your component with `t('your.key')`

### 4. Language Detection

The system automatically:
- Detects browser language on first visit
- Saves language preference to localStorage
- Falls back to English if language not supported

### 5. Changing Language Programmatically

```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();

// Change language
i18n.changeLanguage('es'); // Spanish
i18n.changeLanguage('fr'); // French
i18n.changeLanguage('it'); // Italian
i18n.changeLanguage('sw'); // Kiswahili
i18n.changeLanguage('en'); // English

// Get current language
console.log(i18n.language); // 'en', 'es', etc.
```

## File Structure

```
src/i18n/
├── index.ts          # i18n configuration
├── locales/
│   ├── en.json       # English translations
│   ├── es.json       # Spanish translations
│   ├── fr.json       # French translations
│   ├── it.json       # Italian translations
│   └── sw.json       # Kiswahili translations
└── README.md         # This file
```

## Language Switching in Header

The Header component includes a language selector that:
- Shows current language
- Provides dropdown with all available languages
- Automatically updates all text when language changes
- Persists selection in localStorage