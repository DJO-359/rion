export type Product = {
  id: string;

  title: string;
  price: string;
  category: string;

  description?: string;

  brand?: string;
  country?: string;
  size?: string;
  material?: string;

  status?: string;
  active: boolean;

  images?: string[];

  created: string;
  updated: string;
};

export type Order = {
  id: string;

  name: string;
  phone: string;

  product: string;

  status: string;

  comment?: string;
  manager_name?: string;
  notes?: string;

  created: string;
  updated: string;

  expand?: {
    product?: Product;
  };
};
