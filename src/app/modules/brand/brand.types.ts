export type IBrand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};


export type ICreateBrandRequest = {
  name: string;
  description?: string;
  country?: string;
  logoUrl?: string;
};


export type IUpdateBrandRequest = Partial<ICreateBrandRequest>;


export type IBrandFilters = {
  searchTerm?: string;
  name?: string;
  country?: string;
};