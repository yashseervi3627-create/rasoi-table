import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StarRating } from "@/components/StarRating";
import { Button, EmptyState, PageShell } from "@/components/ui-kit";
import { getFoods } from "@/lib/api";
import { formatINR, useStore } from "@/lib/store";
import type { Category, Dish } from "@/lib/types";

export const Route = createFileRoute("/dish/$dishId")({
  head: () => ({
    meta: [
      { title: "Dish Details — RasoiHub" },
      {
        name: "description",
        content:
          "See ingredients, price, chef profile and customer reviews before you order.",
      },
      {
        property: "og:title",
        content: "Dish Details — RasoiHub",
      },
      {
        property: "og:description",
        content:
          "Ingredients, chef profile and reviews for this homemade dish.",
      },
    ],
  }),
  component: DishDetailPage,
});

function DishDetailPage() {
  const { dishId } = Route.useParams();

  const {
    getDish,
    getChef,
    dishRating,
    chefRating,
    reviewsForDish,
    addToCart,
    addExternalDishToCart,
    state,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [databaseDish, setDatabaseDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  const localDish = getDish(dishId);

  useEffect(() => {
    if (localDish) {
      setLoading(false);
      return;
    }

    const loadDish = async () => {
      try {
        const foods = await getFoods();

        const food = foods.find(
          (item: any) => String(item.id) === String(dishId),
        );

        if (!food) {
          setDatabaseDish(null);
          return;
        }

        const rating = Number(food.average_rating || 0);
        const reviewCount = Number(food.review_count || 0);

        const newDish: Dish = {
          id: String(food.id),
          chefId: String(food.chef_id),
          chefName: food.chef_name,
          name: food.name,
          description:
            food.description ||
            "Homemade food prepared with care.",
          ingredients: [],
          category: (food.category || "Lunch") as Category,
          price: Number(food.price),
          prepTime: "30 min",
          quantity: 99,
          image:
            food.image_url ||
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
          ratingSum: rating * reviewCount,
          ratingCount: reviewCount,
        };

        setDatabaseDish(newDish);
      } catch (error) {
        console.error("Failed to load dish:", error);
        setDatabaseDish(null);
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [dishId, localDish]);

  if (loading) {
    return (
      <PageShell>
        <div className="py-20 text-center text-muted-foreground">
          Loading dish...
        </div>
      </PageShell>
    );
  }

  if (!localDish && !databaseDish) {
    return (
      <PageShell>
        <EmptyState
          icon={<UtensilsCrossed size={24} />}
          title="Dish not found"
          description="This dish may have been removed by the chef."
          action={
            <Link
              to="/explore"
              search={{ q: "", category: "All" }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Back to Explore
            </Link>
          }
        />
      </PageShell>
    );
  }

  const dish: Dish = localDish || databaseDish!;

  const chef = getChef(dish.chefId);

  // FIX: Always make reviews an array
  const reviews = reviewsForDish(dish.id) || [];

  const chefDishCount = state.dishes.filter(
    (item) => item.chefId === dish.chefId,
  ).length;

  const databaseRating =
    dish.ratingCount > 0
      ? dish.ratingSum / dish.ratingCount
      : 0;

  const currentRating = localDish
    ? dishRating(dish)
    : databaseRating;

  function handleAdd() {
    if (databaseDish) {
      for (let i = 0; i < quantity; i++) {
        addExternalDishToCart(databaseDish);
      }
    } else {
      addToCart(dish.id, quantity);
    }

    toast.success(
      `${quantity} × ${dish.name} added to your cart`,
    );
  }

  return (
    <PageShell>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT SIDE */}
        <div>
          <img
            src={dish.image}
            alt={dish.name}
            width={768}
            height={512}
            className="w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
          />

          <div className="mt-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {dish.category}
            </span>

            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              {dish.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <StarRating
                value={currentRating}
                count={dish.ratingCount}
              />

              <span className="inline-flex items-center gap-1">
                <Clock size={15} />
                {dish.prepTime}
              </span>

              <span className="inline-flex items-center gap-1">
                <Package size={15} />
                {dish.quantity} available today
              </span>
            </div>

            <p className="mt-5 leading-relaxed text-muted-foreground">
              {dish.description}
            </p>

            {dish.ingredients &&
              dish.ingredients.length > 0 && (
                <>
                  <h2 className="mt-8 text-xl font-semibold">
                    Ingredients
                  </h2>

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {dish.ingredients.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-accent px-3 py-1.5 text-sm text-accent-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </div>

          {/* REVIEWS */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold">
              Customer Reviews ({reviews.length})
            </h2>

            {reviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="card-soft p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">
                        {review.customerName}
                      </p>

                      <StarRating value={review.rating} />
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.comment}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(
                        review.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No reviews yet. Order this dish and be the first
                to rate it.
              </p>
            )}
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* ORDER BOX */}
          <div className="card-soft p-6">
            <p className="text-sm text-muted-foreground">
              Price per plate
            </p>

            <p className="text-3xl font-semibold">
              {formatINR(dish.price)}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-medium">
                Quantity
              </span>

              <div className="flex items-center gap-3 rounded-full border border-border p-1">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span className="w-6 text-center text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(dish.quantity || 99, q + 1),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                Subtotal
              </span>

              <span className="text-lg font-semibold">
                {formatINR(dish.price * quantity)}
              </span>
            </div>

            <Button
              className="mt-5 w-full"
              onClick={handleAdd}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </Button>

            <Link
              to="/cart"
              className="mt-3 block rounded-full border border-border px-5 py-2.5 text-center text-sm font-semibold hover:bg-secondary"
            >
              Go to Cart
            </Link>
          </div>

          {/* CHEF */}
          {databaseDish?.chefName ? (
            <div className="card-soft p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Cooked by
              </p>

              <div className="mt-4">
                <p className="text-lg font-semibold">
                  {databaseDish.chefName}
                </p>

                <p className="text-sm text-muted-foreground">
                  Home Chef
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-secondary px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Rating
                  </p>

                  <p className="font-semibold">
                    {databaseRating.toFixed(1)} / 5
                  </p>
                </div>

                <div className="rounded-xl bg-secondary px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Reviews
                  </p>

                  <p className="font-semibold">
                    {dish.ratingCount}
                  </p>
                </div>
              </div>
            </div>
          ) : chef ? (
            <div className="card-soft p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Cooked by
              </p>

              <div className="mt-4 flex items-center gap-4">
                <img
                  src={chef.photo}
                  alt={chef.name}
                  loading="lazy"
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div>
                  <p className="text-lg font-semibold">
                    {chef.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {chef.specialty}
                  </p>

                  <StarRating
                    value={chefRating(chef)}
                    count={chef.ratingCount}
                    className="mt-1"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {chef.bio}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-secondary px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Experience
                  </p>

                  <p className="font-semibold">
                    {chef.experience}
                  </p>
                </div>

                <div className="rounded-xl bg-secondary px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Dishes
                  </p>

                  <p className="font-semibold">
                    {chefDishCount}
                  </p>
                </div>
              </div>

              <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={15} />
                {chef.location}
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}