import { Link } from "@tanstack/react-router";
import { Clock, Plus } from "lucide-react";

import { StarRating } from "@/components/StarRating";
import { formatINR, useStore } from "@/lib/store";
import type { Dish } from "@/lib/types";

/** Rich food card used on the landing page and the explore grid. */
export function DishCard({ dish }: { dish: Dish }) {
  const { getChef, dishRating, addToCart } = useStore();
  const chef = getChef(dish.chefId);

  return (
    <article className="card-soft group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <Link to="/dish/$dishId" params={{ dishId: dish.id }} className="block overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              {dish.category}
            </span>
            <h3 className="mt-1 text-lg leading-tight font-semibold">{dish.name}</h3>
          </div>
          <span className="shrink-0 text-lg font-semibold">{formatINR(dish.price)}</span>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {chef && (
            <>
              <img
                src={chef.photo}
                alt={chef.name}
                loading="lazy"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span>{chef.name}</span>
            </>
          )}
          <span className="ml-auto inline-flex items-center gap-1">
            <Clock size={14} /> {dish.prepTime}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <StarRating value={dishRating(dish)} count={dish.ratingCount} />
          <div className="flex gap-2">
            <Link
              to="/dish/$dishId"
              params={{ dishId: dish.id }}
              className="rounded-full border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Details
            </Link>
            <button
              onClick={() => addToCart(dish.id)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus size={15} /> Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
