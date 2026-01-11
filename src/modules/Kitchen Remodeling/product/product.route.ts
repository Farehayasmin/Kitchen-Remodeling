import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();

// Get all products (with optional filters)
router.get('/', ProductController.getAllProducts);

// Get single product
router.get('/:id', ProductController.getProductById);

// Create product
router.post('/', ProductController.createProduct);

// Update product
router.put('/:id', ProductController.updateProduct);

// Update product status
router.patch('/:id/status', ProductController.updateProductStatus);

// Delete product
router.delete('/:id', ProductController.deleteProduct);

// Bulk upload products
router.post('/bulk-upload', ProductController.bulkUploadProducts);

// Search products
router.post('/search', ProductController.searchProducts);

export const productRoutes = router;