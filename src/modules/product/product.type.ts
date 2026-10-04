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
      id: true,
      sku: true,
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
  variantId: string | null;
  variantSku: string | null;

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
    select: { id: true, name: true, slug: true },
  },
  brand: {
    select: { id: true, name: true, slug: true, logo: true },
  },
  variants: {
    where: { isActive: true, deletedAt: null },
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
        select: { id: true, variantId: true, serialNumber: true, status: true },
      },
    },
    orderBy: [{ isDefault: "desc" }, { price: "asc" }],
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
/* Filter input — create/update er jonno                                      */
/* -------------------------------------------------------------------------- */

export interface ProductFilterInput {
  filterId: string;
  filterOptionIds: string[];
}

/* -------------------------------------------------------------------------- */
/* Create / Update inputs                                                     */
/* -------------------------------------------------------------------------- */

export interface CreateProductInput {
  name: string;
  slug?: string;
  description?: string;
  specifications?: Record<string, any>;
  warrantyMonths: number;
  warrantyTerms?: string;
  categoryId?: string;
  brandId?: string;
  isPublished: boolean;
  isActive: boolean;
  variants: CreateVariantInput[];
  filters?: ProductFilterInput[]; // ← NEW
}

export interface CreateVariantInput {
  id?: string;
  attributes: Record<string, any>;
  price: number;
  comparePrice?: number;
  images: string[];
  stockQuantity: number;
  lowStockThreshold?: number;
  isActive: boolean;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  specifications?: Record<string, any>;
  warrantyMonths?: number;
  warrantyTerms?: string;
  categoryId?: string;
  brandId?: string;
  isPublished?: boolean;
  isActive?: boolean;
  variants?: CreateVariantInput[];
  filters?: ProductFilterInput[]; // ← NEW
}

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
/* Product filter value — response er jonno                                   */
/* -------------------------------------------------------------------------- */

export type ProductFilterValue = {
  filterId: string;
  filterName: string;
  filterLabel: string;
  filterType: string;
  optionId: string;
  optionValue: string;
  optionLabel: string | null;
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

  /* ✅ NEW — filter values */
  filters: ProductFilterValue[];

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

// ===================== admin ====================
export const PRODUCT_ADMIN_INCLUDE = {
  brand: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
  variants: {
    orderBy: { isDefault: "desc" },
    select: {
      id: true,
      sku: true,
      price: true,
      comparePrice: true,
      images: true,
      isDefault: true,
      stockQuantity: true,
      _count: { select: { productItems: true } },
    },
  },
  _count: { select: { variants: true } },
} satisfies Prisma.ProductInclude;

export type AdminListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isPublished?: boolean;
  isActive?: boolean;
  stock?: "in" | "low" | "out";
  sort?:
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc";
};

/* Admin-only card data — extends ProductCardData with extra fields */
export type AdminProductCardData = ProductCardData & {
  isPublished: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  variantCount: number;
  totalStock: number; // sum of all variants stock
  totalItems: number; // sum of items (serial units)
};
