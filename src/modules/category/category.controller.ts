import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';

// Get all categories
const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get category by slug
const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // FIX: Explicitly cast slug as string to avoid the 'string | string[]' error
    const slug = req.params.slug as string; 
    const result = await CategoryService.getCategoryBySlug(slug);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // FIX: Cast slug as string
    const slug = req.params.slug as string;
    const filters = req.query;
    const result = await CategoryService.getProductsByCategory(slug, filters);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Create category
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update category
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // FIX: Cast id as string
    const id = req.params.id as string;
    const result = await CategoryService.updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // FIX: Cast id as string
    const id = req.params.id as string;
    await CategoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};