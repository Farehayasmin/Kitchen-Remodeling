import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

// Define params interfaces
interface UserIdParams {
  id: string;
}

interface UserEmailParams {
  email: string;
}

// Get all users
const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query;
    const result = await UserService.getAllUsers(filters as any);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await UserService.getUserById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by email
const getUserByEmail = async (
  req: Request<UserEmailParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const result = await UserService.getUserByEmail(email);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Register/Create user
const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Update user
const updateUser = async (
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await UserService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update user status
const updateUserStatus = async (
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isActive field is required',
      });
    }

    const result = await UserService.updateUserStatus(id, isActive);

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await UserService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Invalid email or password' || error.message === 'Account is inactive') {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Change password
const changePassword = async (
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required',
      });
    }

    const result = await UserService.changePassword(id, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Get user statistics
const getUserStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserService.getUserStatistics();

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
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