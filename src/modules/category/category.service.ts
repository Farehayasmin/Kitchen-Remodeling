import prisma from '../../utils/prisma';
import { calculatePagination, formatPaginationResponse, PaginationOptions } from '../../utils/pagination';

interface CategoryFilters {
  search?: string;
  isActive?: string;
}

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all categories with pagination
const getAllCategories = async (filters: CategoryFilters & PaginationOptions) => {
  const { search, isActive, ...paginationOptions } = filters;

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.category.count({ where }),
  ]);

  return formatPaginationResponse(categories, total, page, limit);
};

// ... rest of your category service methods

export const CategoryService = {
  getAllCategories,
  // ... other methods
};