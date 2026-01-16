import { Router } from 'express';
import { CategoryController } from './category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);


router.get('/:slug/products', CategoryController.getProductsByCategory);

router.get('/:slug', CategoryController.getCategoryBySlug);


router.post('/', CategoryController.createCategory);

router.put('/:id', CategoryController.updateCategory);


router.delete('/:id', CategoryController.deleteCategory);

export const categoryRoutes = router;