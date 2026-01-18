import { Router } from "express";
import { BrandController } from "./brand.controller";

const router = Router();

router.post("/", BrandController.createBrand);
router.get("/", BrandController.getAllBrands);
router.get("/:id", BrandController.getBrandById);
router.patch("/:id", BrandController.updateBrand);
router.delete("/:id", BrandController.deleteBrand);

export const BrandRoutes = router;