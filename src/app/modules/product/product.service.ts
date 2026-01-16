import { ProductFilters } from "../../types/product";
import { calculatePagination, formatPaginationResponse, PaginationOptions } from "../../utils/pagination";
import prisma from "../../utils/prisma";



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

  
  if (category) {
    where.category = category;
  }

 
  if (categoryId) {
    where.categoryId = categoryId;
  }

 
  if (status) {
    where.status = status;
  }


  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

 
  if (brand) {
    where.brand = { contains: brand, mode: 'insensitive' };
  }

  if (supplier) {
    where.supplier = { contains: supplier, mode: 'insensitive' };
  }


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
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return formatPaginationResponse(products, total, page, limit);
};


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
     if (filters.category) where.category = filters.category;
     if (filters.status) where.status = filters.status;
     if (filters.brand) where.brand = filters.brand;
    
     if (filters.priceRange) {
       where.price = {};
       if (filters.priceRange.min) where.price.gte = filters.priceRange.min;
       if (filters.priceRange.max) where.price.lte = filters.priceRange.max;
     }

     if (filters.stockRange) {
       where.stock = {};
       if (filters.stockRange.min !== undefined) where.stock.gte = filters.stockRange.min;
       if (filters.stockRange.max !== undefined) where.stock.lte = filters.stockRange.max;
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


const updateProduct = async (id: string, data: any) => {
  const result = await prisma.product.update({
    where: { id },
    data,
  });
  return result;
};


const updateProductStatus = async (id: string, status: string) => {
  const result = await prisma.product.update({
    where: { id },
    data: { status },
  });
  return result;
};


const deleteProduct = async (id: string) => {
  const result = await prisma.product.delete({
    where: { id },
  });
  return result;
};


const bulkUploadProducts = async (products: any[]) => {
  const result = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
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