import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';

interface OrderIdParams {
  id: string;
}

interface OrderNumberParams {
  orderNumber: string;
}

interface CustomerEmailParams {
  email: string;
}


const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query;
    const result = await OrderService.getAllOrders(filters as any);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req: Request<OrderIdParams>, 
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

const getOrderByOrderNumber = async (
  req: Request<OrderNumberParams>, 
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

const updateOrder = async (
  req: Request<OrderIdParams>, 
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

const updateOrderStatus = async (
  req: Request<OrderIdParams>, 
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

const updatePaymentStatus = async (
  req: Request<OrderIdParams>, // Applied here
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

const deleteOrder = async (
  req: Request<OrderIdParams>,
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

const getCustomerOrders = async (
  req: Request<CustomerEmailParams>, // Applied here
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const paginationOptions = req.query;
    const result = await OrderService.getCustomerOrders(email, paginationOptions as any);

    res.status(200).json({
      success: true,
      message: 'Customer orders retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

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