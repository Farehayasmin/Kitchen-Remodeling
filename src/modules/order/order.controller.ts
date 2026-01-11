import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';

// Get all orders
const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query;
    const result = await OrderService.getAllOrders(filters);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await OrderService.getOrderById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by order number
const getOrderByOrderNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderNumber } = req.params;
    const result = await OrderService.getOrderByOrderNumber(orderNumber);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Create order
const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OrderService.createOrder(req.body);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update order
const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await OrderService.updateOrder(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const result = await OrderService.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update payment status
const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required',
      });
    }

    const result = await OrderService.updatePaymentStatus(id, paymentStatus, paymentMethod);

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete order
const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await OrderService.deleteOrder(id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get customer orders
const getCustomerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const result = await OrderService.getCustomerOrders(email);

    res.status(200).json({
      success: true,
      message: 'Customer orders retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get order statistics
const getOrderStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OrderService.getOrderStatistics();

    res.status(200).json({
      success: true,
      message: 'Order statistics retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  getAllOrders,
  getOrderById,
  getOrderByOrderNumber,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  getCustomerOrders,
  getOrderStatistics,
};