
import { calculatePagination, formatPaginationResponse, PaginationOptions } from '../../utils/pagination';
import prisma from '../../utils/prisma';


interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
}

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Get all orders with filtering and pagination
const getAllOrders = async (filters: OrderFilters & PaginationOptions) => {
  const { search, status, paymentStatus, customerEmail, startDate, endDate, ...paginationOptions } = filters;

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const where: any = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (customerEmail) where.customerEmail = { contains: customerEmail, mode: 'insensitive' };

  if (startDate || endDate) {
    where.orderDate = {};
    if (startDate) where.orderDate.gte = new Date(startDate);
    if (endDate) where.orderDate.lte = new Date(endDate);
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        orderItems: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return formatPaginationResponse(orders, total, page, limit);
};

// Get single order by ID
const getOrderById = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });
  return result;
};

// Get order by order number
const getOrderByOrderNumber = async (orderNumber: string) => {
  const result = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      orderItems: true,
    },
  });
  return result;
};

// Create new order
const createOrder = async (data: any) => {
  const { customerName, customerEmail, customerPhone, customerAddress, orderItems, discount, tax, notes, paymentMethod, customerId } = data;

  // Calculate totals
  let totalAmount = 0;
  const processedItems = orderItems.map((item: any) => {
    const itemTotal = item.quantity * item.unitPrice;
    totalAmount += itemTotal;
    return {
      productId: item.productId,
      productName: item.productName,
      productSku: item.productSku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: itemTotal,
      notes: item.notes,
    };
  });

  const discountAmount = discount || 0;
  const taxAmount = tax || 0;
  const finalAmount = totalAmount - discountAmount + taxAmount;

  const result = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      totalAmount,
      discount: discountAmount,
      tax: taxAmount,
      finalAmount,
      notes,
      paymentMethod,
      orderItems: {
        create: processedItems,
      },
    },
    include: {
      orderItems: true,
    },
  });

  return result;
};

// Update order
const updateOrder = async (id: string, data: any) => {
  const { customerName, customerEmail, customerPhone, customerAddress, status, paymentStatus, notes, orderItems, expectedDate } = data;

  let updateData: any = {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    status,
    paymentStatus,
    notes,
    expectedDate: expectedDate ? new Date(expectedDate) : undefined,
  };

  // If order items are updated, recalculate totals
  if (orderItems && orderItems.length > 0) {
    // Delete existing order items
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Calculate new totals
    let totalAmount = 0;
    const processedItems = orderItems.map((item: any) => {
      const itemTotal = item.quantity * item.unitPrice;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal,
        notes: item.notes,
      };
    });

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    const discountAmount = existingOrder?.discount || 0;
    const taxAmount = existingOrder?.tax || 0;
    const finalAmount = totalAmount - discountAmount + taxAmount;

    updateData = {
      ...updateData,
      totalAmount,
      finalAmount,
      orderItems: {
        create: processedItems,
      },
    };
  }

  const result = await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      orderItems: true,
    },
  });

  return result;
};

// Update order status
const updateOrderStatus = async (id: string, status: string) => {
  const updateData: any = { status };

  // If status is completed, set completion date
  if (status === 'completed') {
    updateData.completionDate = new Date();
  }

  const result = await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      orderItems: true,
    },
  });

  return result;
};

// Update payment status
const updatePaymentStatus = async (id: string, paymentStatus: string, paymentMethod?: string) => {
  const result = await prisma.order.update({
    where: { id },
    data: {
      paymentStatus,
      paymentMethod: paymentMethod || undefined,
    },
    include: {
      orderItems: true,
    },
  });

  return result;
};

// Delete order
const deleteOrder = async (id: string) => {
  // Order items will be deleted automatically due to cascade
  const result = await prisma.order.delete({
    where: { id },
  });
  return result;
};

// Get customer order history
const getCustomerOrders = async (customerEmail: string, paginationOptions?: PaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions || {});

  const where = {
    customerEmail: {
      equals: customerEmail,
      mode: 'insensitive' as const,
    },
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        orderItems: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return formatPaginationResponse(orders, total, page, limit);
};

// Get order statistics
const getOrderStatistics = async () => {
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
  const completedOrders = await prisma.order.count({ where: { status: 'completed' } });
  const cancelledOrders = await prisma.order.count({ where: { status: 'cancelled' } });
  const processingOrders = await prisma.order.count({ where: { status: 'processing' } });

  const totalRevenue = await prisma.order.aggregate({
    where: { status: 'completed', paymentStatus: 'paid' },
    _sum: { finalAmount: true },
  });

  const pendingRevenue = await prisma.order.aggregate({
    where: { status: { in: ['pending', 'processing'] } },
    _sum: { finalAmount: true },
  });

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    totalRevenue: totalRevenue._sum.finalAmount || 0,
    pendingRevenue: pendingRevenue._sum.finalAmount || 0,
  };
};

export const OrderService = {
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