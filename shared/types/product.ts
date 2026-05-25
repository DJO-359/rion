export interface Product {
  id: string;

  title: string;

  price: number;

  category: string;

  image: string;

  active: boolean;

  description?: string;

  brand?: string;

  country?: string;

  size?: string;

  material?: string;
}
