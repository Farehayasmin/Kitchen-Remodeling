import prisma from '../../utils/prisma';
import { calculatePagination, formatPaginationResponse, PaginationOptions } from '../../utils/pagination';

interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
}

// Get all orders with pagination and filters
const getAllOrders = async (filters: OrderFilters & PaginationOptions) => {
  const { search, status, paymentStatus, customerEmail, startDate, endDate, ...paginationOptions } = filters;

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const where: any = {};

  // Search
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Filters
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

// ... rest of your order service methods

export const OrderService = {
  getAllOrders,
  // ... other methods
};