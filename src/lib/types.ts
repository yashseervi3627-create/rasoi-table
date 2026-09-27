/**
 * RasoiHub — shared TypeScript types.
 * Everything the app stores in localStorage is described here.
 */

/** The five order stages shown in the customer's tracking bar. */
export const ORDER_STATUSES = [
  "Order Placed",
  "Order Accepted",
  "Preparing",
  "Ready",
  "Completed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Food categories used by the explore filter tabs. */
export const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Chef {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  bio: string;
  /** Either an imported asset URL or a FileReader data-URL from the signup form. */
  photo: string;
  ratingSum: number;
  ratingCount: number;
}

export interface Dish {
  /** Chef name returned from the database for database foods. */
  chefName?: string;

  id: string;
  chefId: string;
  name: string;
  description: string;
  ingredients: string[];
  category: Category;

  /** Price in Indian Rupees. */
  price: number;

  prepTime: string;
  quantity: number;
  image: string;
  ratingSum: number;
  ratingCount: number;
}

export interface CartItem {
  dishId: string;
  quantity: number;
}

export interface OrderItem {
  dishId: string;
  chefId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: CustomerDetails;
  total: number;
  status: OrderStatus;
  placedAt: string;

  /** Set to true once the customer leaves a review for this order. */
  reviewed: boolean;
}

export interface Review {
  id: string;
  dishId: string;
  chefId: string;
  orderId?: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type Role = "customer" | "chef";

/** The single object persisted to localStorage. */
export interface AppState {
  chefs: Chef[];
  dishes: Dish[];
  orders: Order[];
  reviews: Review[];
  cart: CartItem[];
  role: Role;

  /** id of the chef currently "logged in" (mock auth). */
  currentChefId: string | null;
}

/** Average rating helper — returns 0 when nothing has been rated yet. */
export function averageRating(
  sum: number,
  count: number,
): number {
  if (!count) return 0;

  return Math.round((sum / count) * 10) / 10;
}