import { Request, Response } from 'express';
import { ProductService } from './product.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';

interface ProductParams {
  id: string;
}


const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await ProductService.getAllProducts(filters as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const searchData = { ...req.body, ...req.query };
  const result = await ProductService.searchProducts(searchData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Search completed successfully',
    meta: result.meta,
    data: result.data,
  });
});


const getProductById = catchAsync(async (req: Request<ProductParams>, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getProductById(id);

  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? 'Product retrieved successfully' : 'Product not found',
    data: result,
  });
});


const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});


const updateProduct = catchAsync(async (req: Request<ProductParams>, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.updateProduct(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});


const updateProductStatus = catchAsync(async (req: Request<ProductParams>, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await ProductService.updateProductStatus(id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product status updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request<ProductParams>, res: Response) => {
  const { id } = req.params;
  await ProductService.deleteProduct(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});


const bulkUploadProducts = catchAsync(async (req: Request, res: Response) => {
  const { products } = req.body;

  const result = await ProductService.bulkUploadProducts(products);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `${result.count} products uploaded successfully`,
    data: result,
  });
});

export const ProductController = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  bulkUploadProducts,
  searchProducts,
};