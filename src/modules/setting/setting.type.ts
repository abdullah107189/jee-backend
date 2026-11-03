export interface HeroSlideSetting {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface HeroSideBannerSetting {
  imageSrc: string;
  alt?: string;
  link?: string;
}

export interface TrustBadgeSetting {
  id: string;
  title: string;
  desc: string;
  icon?: string;
}

export interface SystemSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  codEnabled: boolean;
  defaultWarrantyMonths: number;
  warrantyTerms: string;
  auditLoggingEnabled: boolean;
  featuredProductIds?: string[];
  heroSlides?: HeroSlideSetting[];
  heroSideBanner?: HeroSideBannerSetting;
  trustBadges?: TrustBadgeSetting[];
  featuredSectionTitle?: string;
  featuredSectionSubtitle?: string;
  updatedAt: string;
}

export type UpdateSystemSettingsInput = Partial<Omit<SystemSettings, "updatedAt">>;

