import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';

// Get all products
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query;
    const result = await ProductService.getAllProducts(filters);
    
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await ProductService.getProductById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Create product
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ProductService.createProduct(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await ProductService.updateProduct(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update product status
const updateProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const result = await ProductService.updateProductStatus(id, status);
    
    res.status(200).json({
      success: true,
      message: 'Product status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await ProductService.deleteProduct(id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Bulk upload products
const bulkUploadProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required',
      });
    }

    const result = await ProductService.bulkUploadProducts(products);
    
    res.status(201).json({
      success: true,
      message: `${result.count} products uploaded successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Search products
const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchData = req.body;
    const result = await ProductService.searchProducts(searchData);
    
    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
