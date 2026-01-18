import makeSlug from "../../helper/makeSlug";
import { ProductFilters } from "../../types/product";
import { calculatePagination, formatPaginationResponse, PaginationOptions } from "../../utils/pagination";
import prisma from "../../utils/prisma";

// --- EXISTING GET ALL PRODUCTS ---
const getAllProducts = async (filters: ProductFilters & PaginationOptions) => {
  const { search, category, categoryId, status, minPrice, maxPrice, brand, supplier, inStock, ...paginationOptions } = filters;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { supplier: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) where.category = { name: category }; 
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (brand) where.brand = { contains: brand, mode: 'insensitive' };
  if (supplier) where.supplier = { contains: supplier, mode: 'insensitive' };

  if (inStock === 'true') {
    where.stock = { gt: 0 };
  } else if (inStock === 'false') {
    where.stock = { lte: 0 };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { category: true }, 
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  return formatPaginationResponse(products, total, page, limit);
};

// --- SEARCH & OTHER FUNCTIONS ---
const searchProducts = async (searchData: any) => {
  const { query, filters, ...paginationOptions } = searchData;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { sku: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { brand: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (filters) {
    if (filters.category) where.category = { name: filters.category };
    if (filters.status) where.status = filters.status;
    if (filters.brand) where.brand = filters.brand;
    if (filters.priceRange) {
      where.price = {};
      if (filters.priceRange.min) where.price.gte = filters.priceRange.min;
      if (filters.priceRange.max) where.price.lte = filters.priceRange.max;
    }
  }

  const [results, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  return formatPaginationResponse(results, total, page, limit);
};

const getProductById = async (id: string) => {
  return await prisma.product.findUnique({ where: { id }, include: { category: true } });
};



const createProduct = async (payload: any) => {
   const slug = makeSlug(payload.name);
   payload.slug = slug;
  const { category, ...productData } = payload;

  const categoryMatch = await prisma.category.findFirst({
    where: {
     id:{ equals: category, mode: 'insensitive'}
    },
  });

  if (!categoryMatch) {
    throw new Error(`Category '${category}' not found. Please create the category first.`);
  }

  
  const result = await prisma.product.create({
    data: {
      ...productData,
      categoryId: categoryMatch.id, 
      price: Number(productData.price),
      stock: Number(productData.stock),
      // অন্য সব ফিল্ড অটোমেটিক্যালি ম্যাপ হবে
    },
    include: {
      category: true, // রেসপন্সে ক্যাটাগরি তথ্য দেখাবে
    },
  });

  return result;
};



const updateProduct = async (id: string, data: any) => {
  return await prisma.product.update({ where: { id }, data });
};

const updateProductStatus = async (id: string, status: string) => {
  return await prisma.product.update({ where: { id }, data: { status } });
};

const deleteProduct = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};

// --- SUGGESTED BULK UPLOAD UPDATES ---
const bulkUploadProducts = async (products: any[]) => {
  const categories = await prisma.category.findMany();

  const formattedProducts = products.map((product) => {
    const categoryMatch = categories.find(
      (c) => c.name.toLowerCase() === product.category.toLowerCase()
    );

    if (!categoryMatch) {
      throw new Error(`Category '${product.category}' not found. Please create it first.`);
    }

    return {
      name: product.name,
      sku: product.sku,
      description: product.description,
      categoryId: categoryMatch.id,
      price: Number(product.price),
      costPrice: product.costPrice ? Number(product.costPrice) : 0,
      stock: Number(product.stock),
      minStock: product.minStock ? Number(product.minStock) : 0,
      unit: product.unit || 'piece',
      brand: product.brand,
      supplier: product.supplier,
      imageUrl: product.imageUrl || null, 
      tags: product.tags || null,           
      specifications: product.specifications || null, 
      status: product.status || 'active',
      warranty: product.warranty,
    };
  });

  return await prisma.product.createMany({
    data: formattedProducts,
    skipDuplicates: true,
  });
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