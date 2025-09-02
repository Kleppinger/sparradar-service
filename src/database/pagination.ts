import { SelectQueryBuilder } from "typeorm";
import type { ObjectLiteral } from "typeorm";
import type { PaginationQuery, PaginationResult, PaginationMeta } from "@/schemas/pagination";

/**
 * Apply pagination to a TypeORM query builder
 */
export const applyPagination = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationQuery: PaginationQuery
): SelectQueryBuilder<T> => {
  const page = paginationQuery.page || 1;
  const limit = paginationQuery.limit || 10;
  const offset = (page - 1) * limit;

  return queryBuilder
    .skip(offset)
    .take(limit);
};

/**
 * Create pagination metadata
 */
export const createPaginationMeta = (
  total: number,
  paginationQuery: PaginationQuery
): PaginationMeta => {
  const page = paginationQuery.page || 1;
  const limit = paginationQuery.limit || 10;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Execute paginated query and return formatted result
 */
export const executePaginatedQuery = async <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationQuery: PaginationQuery
): Promise<PaginationResult<T>> => {
  // Clone the query builder to get total count
  const totalQuery = queryBuilder.clone();
  const total = await totalQuery.getCount();

  // Apply pagination
  const paginatedQuery = applyPagination(queryBuilder, paginationQuery);
  const data = await paginatedQuery.getMany();

  const pagination = createPaginationMeta(total, paginationQuery);

  return {
    data,
    pagination,
  };
};

// Re-export types for convenience
export type { PaginationQuery, PaginationResult, PaginationMeta } from "../schemas/pagination.js";