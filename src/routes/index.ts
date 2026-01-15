import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { categoryRoutes } from '../modules/category/category.route';
import { productRoutes } from '../modules/product/product.route';
import { orderRoutes } from '../modules/order/order.route';


const router = Router();

router.use('/users', userRoutes);
router.use('/category', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;
