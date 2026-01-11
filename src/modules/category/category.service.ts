import prisma from '../../utils/prisma';

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all categories
const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

// Get category by slug
const getCategoryBySlug = async (slug: string) => {
  const result = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
  return result;
};

// Get products by category slug
const getProductsByCategory = async (slug: string, filters?: any) => {
  const { minPrice, maxPrice, status, search } = filters || {};

  const where: any = { status: status || 'active' };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const result = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return result;
};

// Create new category
const createCategory = async (data: any) => {
  const { name, description, imageUrl, isActive } = data;
  
  // Auto-generate slug from name
  const slug = generateSlug(name);

  const result = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
    },
  });

  return result;
};

// Update category
const updateCategory = async (id: string, data: any) => {
  const { name, description, imageUrl, isActive } = data;

  const updateData: any = {
    description,
    imageUrl,
    isActive,
  };

  // If name is updated, regenerate slug
  if (name) {
    updateData.name = name;
    updateData.slug = generateSlug(name);
  }

  const result = await prisma.category.update({
    where: { id },
    data: updateData,
  });

  return result;
};

// Delete category
const deleteCategory = async (id: string) => {
  // Check if category has products
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (category && category._count.products > 0) {
    throw new Error('Cannot delete category with existing products');
  }

  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

export const CategoryService = {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};