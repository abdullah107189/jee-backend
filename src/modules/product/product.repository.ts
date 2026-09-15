 
/* -------------------------------------------------------------------------- */
/* Types                                                                      */

import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

/* -------------------------------------------------------------------------- */
export interface FindManyProductsArgs {
  where: Prisma.ProductWhereInput;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  skip: number;
  take: number;
  include?: Prisma.ProductInclude;
}

/* -------------------------------------------------------------------------- */
/* Repository                                                                 */
/* -------------------------------------------------------------------------- */
export const productRepository = {
  /**
   * Find many products with optional includes.
   * Return type adapts based on include — uses Prisma's built-in generics.
   */
  findMany<T extends Prisma.ProductFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProductFindManyArgs>,
  ): Promise<Prisma.ProductGetPayload<T>[]> {
    return prisma.product.findMany(args);
  },

  count(where: Prisma.ProductWhereInput): Promise<number> {
    return prisma.product.count({ where });
  },
};
