import prisma from '../../../utils/prisma';


const getAllProducts = async (filters?: any) => {
  const { category, status, minPrice, maxPrice, search } = filters || {};

  const where: any = {};

  if (category) where.category = category;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const result = await prisma.product.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};


const getProductById = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id },
  });
  return result;
};


const createProduct = async (data: any) => {
  const result = await prisma.product.create({
    data,
  });
  return result;
};

// Update product
const updateProduct = async (id: string, data: any) => {
  const result = await prisma.product.update({
    where: { id },
    data,
  });
  return result;
};

// Update product status
const updateProductStatus = async (id: string, status: string) => {
  const result = await prisma.product.update({
    where: { id },
    data: { status },
  });
  return result;
};

// Delete product
const deleteProduct = async (id: string) => {
  const result = await prisma.product.delete({
    where: { id },
  });
  return result;
};

// Bulk upload products
const bulkUploadProducts = async (products: any[]) => {
  const result = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
  return result;
};

// Search products
const searchProducts = async (searchData: any) => {
  const { query, category, status, priceRange } = searchData;

  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { sku: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (category) where.category = category;
  if (status) where.status = status;
  
  if (priceRange) {
    where.price = {};
    if (priceRange.min) where.price.gte = priceRange.min;
    if (priceRange.max) where.price.lte = priceRange.max;
  }

  const result = await prisma.product.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

export const ProductService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  bulkUploadProducts,
  searchProducts,
};

