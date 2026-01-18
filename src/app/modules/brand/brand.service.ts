import prisma from "../../utils/prisma";

const createBrand = async (data: any) => {
 
  const slug = data.name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const result = await prisma.brand.create({
    data: {
      ...data,
      slug,
    },
  });
  return result;
};

const getAllBrands = async () => {
  const result = await prisma.brand.findMany({
    where: { isDeleted: false },
    include: {
      _count: {
        select: { products: true }, 
      },
    },
  });
  return result;
};

const getBrandById = async (id: string) => {
  return await prisma.brand.findUnique({
    where: { id, isDeleted: false },
    include: { products: true },
  });
};

const updateBrand = async (id: string, data: any) => {
 
  if (data.name) {
    data.slug = data.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  }

  return await prisma.brand.update({
    where: { id },
    data,
  });
};

const softDeleteBrand = async (id: string) => {
  return await prisma.brand.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  softDeleteBrand,
};