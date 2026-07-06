// Domain types — mirror the API contract (root README §3) and DB schema.

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  stock: number;
  sku?: string;
}

export interface Attribute {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  brand?: string;
  images: string[];
  variants: Variant[];
  attributes: Attribute[];
  rating: number;
  reviews_count: number;
}

export interface CartLine {
  variant_id: number;
  product_id: number;
  product_name: string;
  variant_name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartLine[];
  total: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  address: string;
  phone: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export interface Me {
  id: number;
  name: string;
  username?: string;
  phone?: string;
  lang: string;
}

export interface Settings {
  shop_name: string;
  currency: string;
  delivery_info: string;
}
