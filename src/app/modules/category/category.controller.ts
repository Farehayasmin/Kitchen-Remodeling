import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const result = await CategoryService.getAllCategories(req.query as any);

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug as string;
    const filters = req.query;
    const result = await CategoryService.getProductsByCategory(slug, filters as any);

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

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory, 
  updateCategory,
  deleteCategory,
};