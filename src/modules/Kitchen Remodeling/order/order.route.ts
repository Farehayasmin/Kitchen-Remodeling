import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

// Get order statistics
router.get('/statistics', OrderController.getOrderStatistics);

// Get customer orders by email
router.get('/customer/:email', OrderController.getCustomerOrders);

// Get all orders (with optional filters)
router.get('/', OrderController.getAllOrders);

// Get order by order number
router.get('/order-number/:orderNumber', OrderController.getOrderByOrderNumber);

// Get single order by ID
router.get('/:id', OrderController.getOrderById);

// Create order
router.post('/', OrderController.createOrder);

// Update order
router.put('/:id', OrderController.updateOrder);

// Update order status
router.patch('/:id/status', OrderController.updateOrderStatus);

// Update payment status
router.patch('/:id/payment', OrderController.updatePaymentStatus);

// Delete order
router.delete('/:id', OrderController.deleteOrder);

export const orderRoutes = router;