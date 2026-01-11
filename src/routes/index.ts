import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { categoryRoutes } from '../modules/category/category.route';
import { productRoutes } from '../modules/Kitchen Remodeling/product/product.route';
import { orderRoutes } from '../modules/Kitchen Remodeling/order/order.route';

const router = Router();
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/kitchen-remodel/products', productRoutes);

export default router;