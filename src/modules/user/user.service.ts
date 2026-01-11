import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';

// Get all users
const getAllUsers = async (filters?: any) => {
  const { role, isActive, search } = filters || {};

  const where: any = {};

  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const result = await prisma.user.findMany({
    where,
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
      // Exclude password
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

// Get single user by ID
const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
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
      // Exclude password
    },
  });
  return result;
};

// Get user by email
const getUserByEmail = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
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
  });
  return result;
};

// Create new user (registration)
const createUser = async (data: any) => {
  const { email, password, name, phone, address, role } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      address,
      role: role || 'customer',
    },
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
  });

  return result;
};

// Update user
const updateUser = async (id: string, data: any) => {
  const { name, phone, address, role, isActive, password } = data;

  const updateData: any = {
    name,
    phone,
    address,
    role,
    isActive,
  };

  // If password is being updated, hash it
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const result = await prisma.user.update({
    where: { id },
    data: updateData,
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
  });

  return result;
};

// Update user status
const updateUserStatus = async (id: string, isActive: boolean) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  return result;
};

// Delete user
const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: { id },
  });
  return result;
};

// Login user
const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    address: user.address,
    role: user.role,
    isActive: user.isActive,
  };
};

// Change password
const changePassword = async (id: string, oldPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};

// Get user statistics
const getUserStatistics = async () => {
  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.user.count({ where: { isActive: true } });
  const customers = await prisma.user.count({ where: { role: 'customer' } });
  const contractors = await prisma.user.count({ where: { role: 'contractor' } });
  const admins = await prisma.user.count({ where: { role: 'admin' } });

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    customers,
    contractors,
    admins,
  };
};

export const UserService = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  loginUser,
  changePassword,
  getUserStatistics,
};