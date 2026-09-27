import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getFoods } from "@/lib/api";
import { useStore } from "@/lib/store";
import type { Category, Dish } from "@/lib/types";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

type Food = {
  id: number;
  chef_id: number;
  chef_name: string;
  name: string;
  description: string | null;
  price: number | string;
  category: string | null;
  image_url: string | null;
  is_available: boolean;
  average_rating: number | string;
  review_count: number | string;
};

function ExplorePage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function loadFoods() {
      try {
        setLoading(true);
        setError("");

        const result = await getFoods();
        setFoods(result.foods || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load foods.");
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = foods
      .map((food) => food.category)
      .filter(
        (category): category is string =>
          Boolean(category),
      );

    return ["All", ...Array.from(new Set(uniqueCategories))];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const searchText = query.toLowerCase();

      const matchesSearch =
        food.name.toLowerCase().includes(searchText) ||
        (food.description || "")
          .toLowerCase()
          .includes(searchText) ||
        (food.chef_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        food.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [foods, query, category]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Explore Food
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Homemade food from local chefs
            </h1>

            <p className="mt-3 text-muted-foreground">
              Discover delicious dishes prepared by
              home chefs and delivered to your table.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search dishes or chefs..."
                className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <SlidersHorizontal
                size={18}
                className="shrink-0 text-muted-foreground"
              />

              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setCategory(item)
                  }
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === item
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card hover:bg-secondary"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Food Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {loading && (
          <div className="py-16 text-center text-muted-foreground">
            Loading foods...
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredFoods.length === 0 && (
            <div className="py-16 text-center">
              <h2 className="text-xl font-semibold">
                No foods found
              </h2>

              <p className="mt-2 text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredFoods.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

function FoodCard({ food }: { food: Food }) {
  const { addExternalDishToCart } = useStore();

  const image =
    food.image_url ||
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

  const rating = Number(food.average_rating);
  const reviewCount = Number(food.review_count);

  function addToCart() {
    const dish: Dish = {
      id: String(food.id),
      chefId: String(food.chef_id),
      name: food.name,
      description:
        food.description ??
        "Homemade food prepared with care.",
      ingredients: [],
      category: (food.category || "Lunch") as Category,
      price: Number(food.price),
      prepTime: "30 min",
      quantity: 1,
      image,
      ratingSum: rating * reviewCount,
      ratingCount: reviewCount,
    };

    addExternalDishToCart(dish);
  }

  return (
    <article className="card-soft group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={food.name}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category + Price */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              {food.category || "Homemade"}
            </span>

            <h3 className="mt-1 text-lg font-semibold leading-tight">
              {food.name}
            </h3>
          </div>

          <span className="shrink-0 text-lg font-semibold">
            ₹{Number(food.price).toFixed(2)}
          </span>
        </div>

        {/* Chef Name */}
        <div className="text-sm font-medium text-muted-foreground">
          Made by{" "}
          <span className="text-foreground">
            {food.chef_name}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {food.description ||
            "Homemade food prepared with care."}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star
              size={15}
              className="fill-current"
            />

            <span>
              {rating > 0
                ? rating.toFixed(1)
                : "New"}
            </span>
          </div>

          {reviewCount > 0 && (
            <span>
              ({reviewCount}{" "}
              {reviewCount === 1
                ? "review"
                : "reviews"}
              )
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={addToCart}
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}