
export enum BannerPlacement {
    // Banners on the main home screen
    HOME_HERO_CAROUSEL = 'HOME_HERO_CAROUSEL', // The main rotating banner at the top
    HOME_CATEGORY_STRIP = 'HOME_CATEGORY_STRIP', // Small banners linking to major categories
    HOME_STATIC_TILE = 'HOME_STATIC_TILE', // A single, non-moving promotional tile
  
    // Banners on product listing or category pages
    CATEGORY_HEADER = 'CATEGORY_HEADER', // A banner at the top of a specific category (e.g., "Snacks & Munchies")
    PRODUCT_LIST_INLINE = 'PRODUCT_LIST_INLINE', // A banner shown in the middle of a product list
  
    // Banners in other specific locations
    SEARCH_PAGE_BANNER = 'SEARCH_PAGE_BANNER', // Shown on the search results page
    CHECKOUT_PAGE_OFFER = 'CHECKOUT_PAGE_OFFER', // Shown on the cart or checkout screen
  }
  
  /**
   * @description Defines WHY the banner exists.
   * This is useful for internal tracking, analytics, and filtering.
   */
  export enum BannerPurpose {
    // General purposes
    GENERAL_PROMOTION = 'GENERAL_PROMOTION', // A generic ad or promotion
    NEW_LAUNCH = 'NEW_LAUNCH', // Highlighting a new product or brand
    SALE_EVENT = 'SALE_EVENT', // For seasonal sales (e.g., Diwali, New Year)
    
    // Specific offer types
    BANK_OFFER = 'BANK_OFFER', // e.g., "10% off with HDFC Bank"
    PAYMENT_WALLET_OFFER = 'PAYMENT_WALLET_OFFER', // e.g., "Cashback with Paytm"
  
    // Informational purposes
    APP_FEATURE_AWARENESS = 'APP_FEATURE_AWARENESS', // e.g., "Now delivering in 10 minutes!"
    BRAND_AWARENESS = 'BRAND_AWARENESS', // Promoting a specific brand without a direct offer
  }
  