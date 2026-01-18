import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();


router.get('/', ProductController.getAllProducts);
router.post('/search', ProductController.searchProducts);
router.post('/bulk-upload', ProductController.bulkUploadProducts);


router.get('/:id', ProductController.getProductById);
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.patch('/:id/status', ProductController.updateProductStatus);
router.delete('/:id', ProductController.deleteProduct);

export const productRoutes = router; 