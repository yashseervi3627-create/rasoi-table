/**
 * Demo data that RasoiHub starts with the very first time it runs.
 * After that everything lives in localStorage, so anything the user
 * adds or changes survives a page refresh.
 */
import type { AppState, Chef, Dish, Review } from "./types";

import chefMeera from "@/assets/chef-meera.jpg";
import chefRavi from "@/assets/chef-ravi.jpg";
import chefAnita from "@/assets/chef-anita.jpg";
import dishPaneer from "@/assets/dish-paneer.jpg";
import dishDosa from "@/assets/dish-dosa.jpg";
import dishBiryani from "@/assets/dish-biryani.jpg";
import dishSamosa from "@/assets/dish-samosa.jpg";
import dishGulab from "@/assets/dish-gulabjamun.jpg";
import dishPoha from "@/assets/dish-poha.jpg";

const chefs: Chef[] = [
  {
    id: "chef-1",
    name: "Meera Sharma",
    specialty: "North Indian Home Cooking",
    experience: "12 years",
    location: "Jaipur, Rajasthan",
    bio: "I cook the way my mother taught me — slow-simmered gravies, freshly ground masalas and absolutely no shortcuts.",
    photo: chefMeera,
    ratingSum: 226,
    ratingCount: 48,
  },
  {
    id: "chef-2",
    name: "Ravi Iyer",
    specialty: "South Indian Tiffin",
    experience: "8 years",
    location: "Coimbatore, Tamil Nadu",
    bio: "Batter fermented overnight, chutney ground on stone. Breakfast is a serious business in my kitchen.",
    photo: chefRavi,
    ratingSum: 154,
    ratingCount: 33,
  },
  {
    id: "chef-3",
    name: "Anita Deshmukh",
    specialty: "Snacks & Desserts",
    experience: "5 years",
    location: "Pune, Maharashtra",
    bio: "Weekend baker turned full-time home chef. Everything leaves my kitchen warm and freshly made.",
    photo: chefAnita,
    ratingSum: 122,
    ratingCount: 27,
  },
];

const dishes: Dish[] = [
  {
    id: "dish-1",
    chefId: "chef-1",
    name: "Paneer Butter Masala",
    description:
      "Soft home-set paneer cubes simmered in a slow-cooked tomato and cashew gravy, finished with white butter and kasuri methi.",
    ingredients: ["Home-set paneer", "Tomatoes", "Cashew paste", "White butter", "Kasuri methi", "Fresh cream"],
    category: "Dinner",
    price: 240,
    prepTime: "35 mins",
    quantity: 12,
    image: dishPaneer,
    ratingSum: 89,
    ratingCount: 19,
  },
  {
    id: "dish-2",
    chefId: "chef-2",
    name: "Crispy Masala Dosa",
    description:
      "Overnight-fermented batter griddled to a lacy crisp, filled with soft potato masala. Served with coconut chutney and sambar.",
    ingredients: ["Rice & urad batter", "Potatoes", "Curry leaves", "Coconut chutney", "Sambar"],
    category: "Breakfast",
    price: 120,
    prepTime: "20 mins",
    quantity: 20,
    image: dishDosa,
    ratingSum: 71,
    ratingCount: 15,
  },
  {
    id: "dish-3",
    chefId: "chef-1",
    name: "Hyderabadi Chicken Biryani",
    description:
      "Long-grain basmati layered with marinated chicken and saffron milk, sealed and dum-cooked. Comes with raita and salan.",
    ingredients: ["Basmati rice", "Chicken", "Saffron", "Fried onions", "Mint", "Yoghurt"],
    category: "Lunch",
    price: 320,
    prepTime: "50 mins",
    quantity: 8,
    image: dishBiryani,
    ratingSum: 96,
    ratingCount: 20,
  },
  {
    id: "dish-4",
    chefId: "chef-3",
    name: "Punjabi Samosa (4 pcs)",
    description:
      "Flaky hand-folded pastry stuffed with spiced potato and peas, fried to order. Served with mint chutney.",
    ingredients: ["Refined flour", "Potatoes", "Green peas", "Ajwain", "Mint chutney"],
    category: "Snacks",
    price: 90,
    prepTime: "25 mins",
    quantity: 30,
    image: dishSamosa,
    ratingSum: 55,
    ratingCount: 12,
  },
  {
    id: "dish-5",
    chefId: "chef-3",
    name: "Warm Gulab Jamun (6 pcs)",
    description:
      "Khoya dumplings fried on a low flame and soaked in cardamom-rose syrup. Delivered warm, topped with pistachio.",
    ingredients: ["Khoya", "Cardamom", "Rose water", "Sugar syrup", "Pistachio"],
    category: "Desserts",
    price: 150,
    prepTime: "30 mins",
    quantity: 15,
    image: dishGulab,
    ratingSum: 62,
    ratingCount: 13,
  },
  {
    id: "dish-6",
    chefId: "chef-2",
    name: "Kanda Poha",
    description:
      "Light, fluffy flattened rice tempered with mustard, curry leaves and onion, finished with lemon and roasted peanuts.",
    ingredients: ["Flattened rice", "Onion", "Peanuts", "Curry leaves", "Lemon", "Coriander"],
    category: "Breakfast",
    price: 80,
    prepTime: "15 mins",
    quantity: 25,
    image: dishPoha,
    ratingSum: 42,
    ratingCount: 9,
  },
];

const reviews: Review[] = [
  {
    id: "rev-1",
    dishId: "dish-1",
    chefId: "chef-1",
    customerName: "Rohit Nair",
    rating: 5,
    comment: "Tasted exactly like a home kitchen should. The gravy was rich without being heavy.",
    createdAt: "2026-08-14T10:20:00.000Z",
  },
  {
    id: "rev-2",
    dishId: "dish-1",
    chefId: "chef-1",
    customerName: "Sneha Kulkarni",
    rating: 4,
    comment: "Generous portion and still warm on arrival. Would order again for a family dinner.",
    createdAt: "2026-08-21T16:05:00.000Z",
  },
  {
    id: "rev-3",
    dishId: "dish-3",
    chefId: "chef-1",
    customerName: "Imran Qureshi",
    rating: 5,
    comment: "Proper dum biryani. The salan alone is worth the price.",
    createdAt: "2026-09-01T13:40:00.000Z",
  },
  {
    id: "rev-4",
    dishId: "dish-2",
    chefId: "chef-2",
    customerName: "Divya Menon",
    rating: 5,
    comment: "Crisp all the way to the last bite and the chutney is freshly ground. Breakfast sorted.",
    createdAt: "2026-09-03T07:55:00.000Z",
  },
  {
    id: "rev-5",
    dishId: "dish-5",
    chefId: "chef-3",
    customerName: "Aarav Gupta",
    rating: 4,
    comment: "Soft, warm and not overly sweet. Packed really well too.",
    createdAt: "2026-09-05T19:10:00.000Z",
  },
];

/** Fresh state used on first load (and by "reset demo data"). */
export function createSeedState(): AppState {
  return {
    chefs,
    dishes,
    orders: [],
    reviews,
    cart: [],
    role: "customer",
    currentChefId: null,
  };
}

export const TESTIMONIALS = [
  {
    name: "Priya Raghavan",
    city: "Bengaluru",
    quote:
      "I moved cities for work and RasoiHub is the closest I have come to eating at home. Meera's dal is now a weekly ritual.",
  },
  {
    name: "Karan Malhotra",
    city: "Delhi",
    quote:
      "You can actually see who is cooking your food and what goes into it. That transparency is why I stopped ordering from restaurants.",
  },
  {
    name: "Fatima Sheikh",
    city: "Hyderabad",
    quote:
      "Ordered biryani for eight people at short notice. It arrived hot, on time, and every single person asked for the chef's name.",
  },
];
