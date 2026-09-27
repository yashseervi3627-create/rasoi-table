/**
 * RasoiHub global store.
 *
 * A small React context + reducer that keeps the whole app state in one
 * object and mirrors it to localStorage on every change.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { createSeedState } from "./seed";
import {
  ORDER_STATUSES,
  averageRating,
  type AppState,
  type CartItem,
  type Chef,
  type CustomerDetails,
  type Dish,
  type Order,
  type OrderStatus,
  type Review,
  type Role,
} from "./types";

const STORAGE_KEY = "rasoihub-state-v1";

/** Simple unique-id helper. */
const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;

type Action =
  | { type: "hydrate"; state: AppState }
  | { type: "setRole"; role: Role }
  | { type: "registerChef"; chef: Chef }
  | { type: "loginChef"; chefId: string }
  | { type: "logoutChef" }
  | { type: "addDish"; dish: Dish }
  | { type: "addExternalDishToCart"; dish: Dish }
  | { type: "updateDish"; dish: Dish }
  | { type: "deleteDish"; dishId: string }
  | { type: "addToCart"; dishId: string; quantity: number }
  | { type: "setCartQuantity"; dishId: string; quantity: number }
  | { type: "removeFromCart"; dishId: string }
  | { type: "clearCart" }
  | { type: "placeOrder"; order: Order }
  | { type: "setOrderStatus"; orderId: string; status: OrderStatus }
  | { type: "addReview"; review: Review }
  | { type: "reset" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "setRole":
      return { ...state, role: action.role };

    case "registerChef":
      return {
        ...state,
        chefs: [...state.chefs, action.chef],
        currentChefId: action.chef.id,
        role: "chef",
      };

    case "loginChef":
      return {
        ...state,
        currentChefId: action.chefId,
        role: "chef",
      };

    case "logoutChef":
      return {
        ...state,
        currentChefId: null,
        role: "customer",
      };

    case "addDish":
      return {
        ...state,
        dishes: [action.dish, ...state.dishes],
      };

    case "addExternalDishToCart": {
      const existingDish = state.dishes.find(
        (dish) => dish.id === action.dish.id,
      );

      const dishes = existingDish
        ? state.dishes
        : [action.dish, ...state.dishes];

      const existingCartItem = state.cart.find(
        (item) => item.dishId === action.dish.id,
      );

      const cart = existingCartItem
        ? state.cart.map((item) =>
            item.dishId === action.dish.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          )
        : [
            ...state.cart,
            {
              dishId: action.dish.id,
              quantity: 1,
            },
          ];

      return {
        ...state,
        dishes,
        cart,
      };
    }

    case "updateDish":
      return {
        ...state,
        dishes: state.dishes.map((d) =>
          d.id === action.dish.id ? action.dish : d,
        ),
      };

    case "deleteDish":
      return {
        ...state,
        dishes: state.dishes.filter(
          (d) => d.id !== action.dishId,
        ),
        cart: state.cart.filter(
          (c) => c.dishId !== action.dishId,
        ),
      };

    case "addToCart": {
      const existing = state.cart.find(
        (c) => c.dishId === action.dishId,
      );

      const cart = existing
        ? state.cart.map((c) =>
            c.dishId === action.dishId
              ? {
                  ...c,
                  quantity: c.quantity + action.quantity,
                }
              : c,
          )
        : [
            ...state.cart,
            {
              dishId: action.dishId,
              quantity: action.quantity,
            },
          ];

      return {
        ...state,
        cart,
      };
    }

    case "setCartQuantity":
      return {
        ...state,
        cart: state.cart
          .map((c) =>
            c.dishId === action.dishId
              ? {
                  ...c,
                  quantity: action.quantity,
                }
              : c,
          )
          .filter((c) => c.quantity > 0),
      };

    case "removeFromCart":
      return {
        ...state,
        cart: state.cart.filter(
          (c) => c.dishId !== action.dishId,
        ),
      };

    case "clearCart":
      return {
        ...state,
        cart: [],
      };

    case "placeOrder":
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: [],
      };

    case "setOrderStatus":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? {
                ...o,
                status: action.status,
              }
            : o,
        ),
      };

    case "addReview": {
      const { review } = action;

      return {
        ...state,
        reviews: [review, ...state.reviews],

        dishes: state.dishes.map((d) =>
          d.id === review.dishId
            ? {
                ...d,
                ratingSum: d.ratingSum + review.rating,
                ratingCount: d.ratingCount + 1,
              }
            : d,
        ),

        chefs: state.chefs.map((c) =>
          c.id === review.chefId
            ? {
                ...c,
                ratingSum: c.ratingSum + review.rating,
                ratingCount: c.ratingCount + 1,
              }
            : c,
        ),

        orders: review.orderId
          ? state.orders.map((o) =>
              o.id === review.orderId
                ? {
                    ...o,
                    reviewed: true,
                  }
                : o,
            )
          : state.orders,
      };
    }

    case "reset":
      return createSeedState();

    default:
      return state;
  }
}

interface StoreValue {
  state: AppState;
  ready: boolean;

  // Role / chef session
  setRole: (role: Role) => void;
  registerChef: (
    input: Omit<
      Chef,
      "id" | "ratingSum" | "ratingCount"
    >,
  ) => Chef;
  loginChef: (chefId: string) => void;
  logoutChef: () => void;
  currentChef: Chef | null;

  // Menu management
  addDish: (
    input: Omit<
      Dish,
      "id" | "ratingSum" | "ratingCount"
    >,
  ) => void;

  addExternalDishToCart: (dish: Dish) => void;

  updateDish: (dish: Dish) => void;
  deleteDish: (dishId: string) => void;

  // Cart
  addToCart: (
    dishId: string,
    quantity?: number,
  ) => void;

  setCartQuantity: (
    dishId: string,
    quantity: number,
  ) => void;

  removeFromCart: (dishId: string) => void;
  clearCart: () => void;

  cartCount: number;
  cartTotal: number;
  cartDetails: {
    item: CartItem;
    dish: Dish;
  }[];

  // Orders
  placeOrder: (
    customer: CustomerDetails,
  ) => Order | null;

  advanceOrder: (orderId: string) => void;

  // Reviews
  addReview: (
    input: Omit<Review, "id" | "createdAt">,
  ) => void;

  // Lookups
  getDish: (id: string) => Dish | undefined;
  getChef: (id: string) => Chef | undefined;
  dishRating: (dish: Dish) => number;
  chefRating: (chef: Chef) => number;
  reviewsForDish: (dishId: string) => Review[];
  resetDemoData: () => void;
}

const StoreContext =
  createContext<StoreValue | null>(null);

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    createSeedState,
  );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const saved = JSON.parse(raw) as AppState;

        dispatch({
          type: "hydrate",
          state: {
            ...createSeedState(),
            ...saved,
          },
        });
      }
    } catch {
      // Keep seed data if localStorage is corrupted.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state),
      );
    } catch {
      // Storage full or blocked.
    }
  }, [state, ready]);

  const value = useMemo<StoreValue>(() => {
    const getDish = (id: string) =>
      state.dishes.find((d) => d.id === id);

    const getChef = (id: string) =>
      state.chefs.find((c) => c.id === id);

    const cartDetails = state.cart
      .map((item) => ({
        item,
        dish: getDish(item.dishId),
      }))
      .filter(
        (
          entry,
        ): entry is {
          item: CartItem;
          dish: Dish;
        } => Boolean(entry.dish),
      );

    return {
      state,
      ready,

      setRole: (role) =>
        dispatch({
          type: "setRole",
          role,
        }),

      registerChef: (input) => {
        const chef: Chef = {
          ...input,
          id: uid("chef"),
          ratingSum: 0,
          ratingCount: 0,
        };

        dispatch({
          type: "registerChef",
          chef,
        });

        return chef;
      },

      loginChef: (chefId) =>
        dispatch({
          type: "loginChef",
          chefId,
        }),

      logoutChef: () =>
        dispatch({
          type: "logoutChef",
        }),

      currentChef: state.currentChefId
        ? getChef(state.currentChefId) ?? null
        : null,

      addDish: (input) =>
        dispatch({
          type: "addDish",
          dish: {
            ...input,
            id: uid("dish"),
            ratingSum: 0,
            ratingCount: 0,
          },
        }),

      addExternalDishToCart: (dish) =>
        dispatch({
          type: "addExternalDishToCart",
          dish,
        }),

      updateDish: (dish) =>
        dispatch({
          type: "updateDish",
          dish,
        }),

      deleteDish: (dishId) =>
        dispatch({
          type: "deleteDish",
          dishId,
        }),

      addToCart: (
        dishId,
        quantity = 1,
      ) =>
        dispatch({
          type: "addToCart",
          dishId,
          quantity,
        }),

      setCartQuantity: (
        dishId,
        quantity,
      ) =>
        dispatch({
          type: "setCartQuantity",
          dishId,
          quantity,
        }),

      removeFromCart: (dishId) =>
        dispatch({
          type: "removeFromCart",
          dishId,
        }),

      clearCart: () =>
        dispatch({
          type: "clearCart",
        }),

      cartCount: state.cart.reduce(
        (n, c) => n + c.quantity,
        0,
      ),

      cartTotal: cartDetails.reduce(
        (sum, { item, dish }) =>
          sum + dish.price * item.quantity,
        0,
      ),

      cartDetails,

      placeOrder: (customer) => {
        if (!cartDetails.length) return null;

        const order: Order = {
          id: uid("ORD"),

          items: cartDetails.map(
            ({ item, dish }) => ({
              dishId: dish.id,
              chefId: dish.chefId,
              name: dish.name,
              image: dish.image,
              price: dish.price,
              quantity: item.quantity,
            }),
          ),

          customer,

          total: cartDetails.reduce(
            (sum, { item, dish }) =>
              sum +
              dish.price * item.quantity,
            0,
          ),

          status: "Order Placed",
          placedAt:
            new Date().toISOString(),
          reviewed: false,
        };

        dispatch({
          type: "placeOrder",
          order,
        });

        return order;
      },

      advanceOrder: (orderId) => {
        const order = state.orders.find(
          (o) => o.id === orderId,
        );

        if (!order) return;

        const next =
          ORDER_STATUSES[
            ORDER_STATUSES.indexOf(
              order.status,
            ) + 1
          ];

        if (next) {
          dispatch({
            type: "setOrderStatus",
            orderId,
            status: next,
          });
        }
      },

      addReview: (input) =>
        dispatch({
          type: "addReview",
          review: {
            ...input,
            id: uid("rev"),
            createdAt:
              new Date().toISOString(),
          },
        }),

      getDish,
      getChef,

      dishRating: (dish) =>
        averageRating(
          dish.ratingSum,
          dish.ratingCount,
        ),

      chefRating: (chef) =>
        averageRating(
          chef.ratingSum,
          chef.ratingCount,
        ),

      reviewsForDish: (dishId) =>
        state.reviews.filter(
          (r) => r.dishId === dishId,
        ),

      resetDemoData: () =>
        dispatch({
          type: "reset",
        }),
    };
  }, [state, ready]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

/** Access the RasoiHub store from any component. */
export function useStore() {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw new Error(
      "useStore must be used inside <StoreProvider>",
    );
  }

  return ctx;
}

/** ₹ formatter used across the app. */
export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}