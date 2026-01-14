import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { calculatePagination, formatPaginationResponse, PaginationOptions } from '../../utils/pagination';

interface UserFilters {
  search?: string;
  role?: string;
  isActive?: string;
}


const getAllUsers = async (filters: UserFilters & PaginationOptions) => {
  const { search, role, isActive, ...paginationOptions } = filters;

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const where: any = {};


  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Filters
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return formatPaginationResponse(users, total, page, limit);
};



export const UserService = {
  getAllUsers,
 
};