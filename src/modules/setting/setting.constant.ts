import type { SystemSettings } from "./setting.type";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  storeName: "JEE Bangladesh",
  supportEmail: "support@JEE.bd",
  supportPhone: "+880 1700-000000",
  currency: "BDT (৳)",
  codEnabled: true,
  defaultWarrantyMonths: 12,
  warrantyTerms:
    "Covers manufacturing defects for motor and mainboard components. Physical, liquid or accidental damage voids warranty automatically.",
  auditLoggingEnabled: true,
  featuredProductIds: [],
  heroSlides: [
    {
      id: "slide-1",
      title: "iPhone 17 Pro Max, in stock now",
      subtitle: "Titanium build, A19 Pro chip — official warranty included",
      ctaLabel: "Shop iPhone 17",
      ctaHref: "/products",
      imageSrc: "/images/hero/fan1.jpg",
      imageAlt: "iPhone 17 Pro Max",
    },
    {
      id: "slide-2",
      title: "MacBook Air M5, up to ৳15,000 off",
      subtitle: "0% EMI up to 12 months on all card purchases",
      ctaLabel: "Shop MacBooks",
      ctaHref: "/products",
      imageSrc: "/images/hero/light.jpg",
      imageAlt: "MacBook Air M5",
    },
    {
      id: "slide-3",
      title: "Galaxy Watch Ultra, ৳5,000 off",
      subtitle: "Track every workout, call and text from your wrist",
      ctaLabel: "Shop smartwatches",
      ctaHref: "/products",
      imageSrc: "/images/hero/ac_hero.webp",
      imageAlt: "Galaxy Watch Ultra",
    },
  ],
  heroSideBanner: {
    imageSrc: "/images/hero/ac_hero.webp",
    alt: "Air conditioner offer",
    link: "/products",
  },
  trustBadges: [
    {
      id: "badge-1",
      title: "Nationwide Delivery",
      desc: "Carefully packed & fast shipping",
      icon: "Truck",
    },
    {
      id: "badge-2",
      title: "100% Genuine Warranty",
      desc: "Active digital verification",
      icon: "ShieldCheck",
    },
    {
      id: "badge-3",
      title: "Easy Claim Process",
      desc: "Online repair & replace service",
      icon: "RotateCcw",
    },
    {
      id: "badge-4",
      title: "Dedicated Support",
      desc: "24/7 hotline & technical desk",
      icon: "Headphones",
    },
  ],
  featuredSectionTitle: "Featured Products",
  featuredSectionSubtitle: "Best-selling electronics with long-term digital warranties",
  updatedAt: new Date().toISOString(),
};

export const SETTING_MESSAGES = {
  FETCH_SUCCESS: "System configuration retrieved successfully",
  UPDATE_SUCCESS: "System configuration updated successfully",
  BACKUP_SUCCESS: "Database snapshot generated successfully",
};

