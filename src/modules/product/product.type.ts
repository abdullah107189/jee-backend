import { Prisma } from "../../../prisma/generated/prisma/client";

/* -------------------------------------------------------------------------- */
/* Card list include — minimal                                                */
/* -------------------------------------------------------------------------- */

export const PRODUCT_CARD_INCLUDE = {
  category: {
    select: {
      name: true,
    },
  },

  brand: {
    select: {
      name: true,
    },
  },

  variants: {
    where: {
      isActive: true,
      deletedAt: null,
    },
    orderBy: [{ isDefault: "desc" }, { price: "asc" }] as const,
    select: {
      price: true,
      comparePrice: true,
      images: true,
      isDefault: true,
      stockQuantity: true,
    },
  },
} satisfies Prisma.ProductInclude;

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;

  price: number;
  comparePrice: number | null;

  image: string | null;

  warrantyMonths: number;
  stockQuantity: number;

  brandName: string | null;
  categoryName: string | null;
};

/* -------------------------------------------------------------------------- */
/* Detail include — full                                                      */
/* -------------------------------------------------------------------------- */

export const PRODUCT_DETAIL_INCLUDE = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
    },
  },

  variants: {
    where: {
      isActive: true,
      deletedAt: null,
    },

    select: {
      id: true,
      sku: true,
      attributes: true,
      price: true,
      comparePrice: true,
      images: true,
      isDefault: true,
      stockQuantity: true,

      productItems: {
        select: {
          id: true,
          variantId: true,
          serialNumber: true,
          status: true,
        },
      },
    },

    orderBy: [{ isDefault: "desc" }, { price: "asc" }] as const,
  },
} satisfies Prisma.ProductInclude;

export type ProductWithDetailRelations = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_DETAIL_INCLUDE;
}>;

/* -------------------------------------------------------------------------- */
/* Full include — create/update response er jonno                             */
/* -------------------------------------------------------------------------- */

export const PRODUCT_INCLUDE = PRODUCT_DETAIL_INCLUDE;

export type ProductWithRelations = ProductWithDetailRelations;

/* -------------------------------------------------------------------------- */
/* Detail response shape — frontend er jonno                                  */
/* -------------------------------------------------------------------------- */

export type ProductVariantDetail = {
  id: string;
  sku: string;

  attributes: Record<string, string | number | boolean | null>;

  price: number;
  comparePrice: number | null;

  images: string[];

  isDefault: boolean;
  stockQuantity: number;
};

/* -------------------------------------------------------------------------- */
/* Product detail response                                                    */
/* -------------------------------------------------------------------------- */

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;

  description: string | null;

  specifications: Record<string, string> | null;

  warrantyMonths: number;
  warrantyTerms: string | null;

  isPublished: boolean;
  isActive: boolean;

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  } | null;

  variants: ProductVariantDetail[];

  /* Aggregated fields for card / SEO */

  price: number;
  comparePrice: number | null;

  images: string[];

  totalStock: number;
  inStock: boolean;

  createdAt: string;
  updatedAt: string;
};

/* -------------------------------------------------------------------------- */
/* Related product — lightweight card                                         */
/* -------------------------------------------------------------------------- */

export type RelatedProduct = {
  id: string;
  name: string;
  slug: string;

  price: number;
  comparePrice: number | null;

  image: string | null;

  brandName: string | null;
};
