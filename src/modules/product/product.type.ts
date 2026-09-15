/* -------------------------------------------------------------------------- */
/* Types                                                                      */

import { SortOption } from "../../utils/query";

/* -------------------------------------------------------------------------- */
export interface ProductListQuery {
  search?: string;
  categoryId?: string;
  brandId?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  isPublished?: boolean;
  isActive?: boolean;
  skip: number;
  take: number;
}

/** Minimal card data — sudhu list page e lage */
export interface ProductCardData {
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
}

export interface ProductListResult {
  items: ProductCardData[];
  total: number;
}