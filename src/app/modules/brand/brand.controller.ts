import { Request, Response } from "express";


import { BrandService } from "./brand.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrand(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.getAllBrands();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brands retrieved successfully",
    data: result,
  });
});

const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.getBrandById(req.params.id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: !!result,
    message: result ? "Brand retrieved successfully" : "Brand not found",
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.updateBrand(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  await BrandService.softDeleteBrand(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brand deleted successfully",
    data: null,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};