import prisma from '../../utils/prisma';
import { calculatePagination, formatPaginationResponse, PaginationOptions } from '../../utils/pagination';

interface CategoryFilters {
  search?: string;
  isActive?: string;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

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

// --- ADDED MISSING FUNCTIONS BELOW ---

const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: { products: true },
  });
};

const getProductsByCategory = async (slug: string, options: PaginationOptions) => {
  const { limit, skip } = calculatePagination(options);
  
  // This finds the category and paginates the products inside it
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        skip,
        take: limit,
      },
      _count: {
        select: { products: true }
      }
    }
  });
};

const createCategory = async (payload: any) => {
  if (payload.name && !payload.slug) {
    payload.slug = generateSlug(payload.name);
  }
  return await prisma.category.create({
    data: payload,
  });
};

const updateCategory = async (id: string, payload: any) => {
  if (payload.name) {
    payload.slug = generateSlug(payload.name);
  }
  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};