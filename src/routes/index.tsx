import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  HandPlatter,
  Leaf,
  Quote,
  Search,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { DishCard } from "@/components/DishCard";
import { SectionHeading } from "@/components/ui-kit";
import heroImage from "@/assets/hero-kitchen.jpg";
import { TESTIMONIALS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { CATEGORIES, type Category, type Dish } from "@/lib/types";
import { getFoods } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RasoiHub — Homemade Food from Chefs You Can Trust" },
      {
        name: "description",
        content:
          "RasoiHub delivers freshly cooked homemade meals from verified home chefs near you. Browse dishes, order in a tap and track your food live.",
      },
      {
        property: "og:title",
        content: "RasoiHub — Homemade Food from Chefs You Can Trust",
      },
      {
        property: "og:description",
        content:
          "Freshly cooked homemade meals from verified home chefs near you.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Home Chefs",
    text: "Every kitchen is checked for hygiene and every chef has a real profile with photos, location and experience.",
  },
  {
    icon: Leaf,
    title: "Cooked Fresh To Order",
    text: "Nothing is pre-made or reheated. Your food starts cooking only after you place the order.",
  },
  {
    icon: HandPlatter,
    title: "Honest Home Portions",
    text: "Generous, everyday portions priced fairly — the way food is served at home, not at a restaurant.",
  },
  {
    icon: Truck,
    title: "Live Order Tracking",
    text: "Watch your order move from Placed to Accepted, Preparing, Ready and Completed in real time.",
  },
];

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    text: "Search by dish, cuisine or chef and browse kitchens near you.",
  },
  {
    icon: ShoppingBag,
    title: "Order",
    text: "Add to cart, add your delivery details and confirm in seconds.",
  },
  {
    icon: Soup,
    title: "Chef Cooks",
    text: "Your home chef accepts and starts cooking your meal fresh.",
  },
  {
    icon: Star,
    title: "Enjoy & Rate",
    text: "Receive your food warm, then rate the dish and the chef.",
  },
];

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

function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<Dish[]>([]);

  useEffect(() => {
    async function loadFoods() {
      try {
        const result = await getFoods();

        const databaseFoods: Food[] = result.foods || [];

        const dishes: Dish[] = databaseFoods.map((food) => {
          const rating = Number(food.average_rating);
          const reviewCount = Number(food.review_count);

          return {
            id: String(food.id),
            chefId: String(food.chef_id),
            chefName: food.chef_name,
            name: food.name,
            description:
              food.description ??
              "Homemade food prepared with care.",
            ingredients: [],
            category: (food.category || "Lunch") as Category,
            price: Number(food.price),
            prepTime: "30 min",
            quantity: 1,
            image:
              food.image_url ||
              "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
            ratingSum: rating * reviewCount,
            ratingCount: reviewCount,
          };
        });

        setFoods(dishes);
      } catch (error) {
        console.error("Failed to load home foods:", error);
      }
    }

    loadFoods();
  }, []);

  const featured = [...foods]
    .sort((a, b) => {
      const ratingA = a.ratingCount
        ? a.ratingSum / a.ratingCount
        : 0;

      const ratingB = b.ratingCount
        ? b.ratingSum / b.ratingCount
        : 0;

      return ratingB - ratingA;
    })
    .slice(0, 6);

  function search(e: React.FormEvent) {
    e.preventDefault();

    navigate({
      to: "/explore",
      search: {
        q: query,
        category: "All",
      },
    });
  }

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-[var(--cream)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <BadgeCheck size={14} /> 120+ verified home kitchens
            </span>

            <h1 className="mt-5 text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-6xl">
              Homemade Food. Made by People You Can Trust.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              RasoiHub brings you slow-cooked, freshly made meals from home
              chefs in your neighbourhood — from home kitchens to your table.
            </p>

            <form
              onSubmit={search}
              className="mt-8 flex items-center gap-2 rounded-full border border-border bg-card p-2 shadow-[var(--shadow-soft)]"
            >
              <Search
                size={18}
                className="ml-3 shrink-0 text-muted-foreground"
              />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search biryani, dosa, a chef or a cuisine…"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />

              <button
                type="submit"
                className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c}
                  to="/explore"
                  search={{ q: "", category: c }}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Home chef holding a freshly cooked thali in her kitchen"
              width={1408}
              height={1008}
              className="w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
            />

            <div className="card-soft absolute -bottom-6 left-4 hidden items-center gap-3 px-4 py-3 sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <ChefHat size={18} />
              </span>

              <div>
                <p className="text-sm font-semibold">
                  4.8 average rating
                </p>

                <p className="text-xs text-muted-foreground">
                  across 3,400+ home-cooked orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Why RasoiHub ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          center
          eyebrow="Why RasoiHub"
          title="Food with a face behind it"
          subtitle="We are not a restaurant aggregator. Every meal here is cooked by a real person in a real home kitchen."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-soft p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <f.icon size={20} />
              </span>

              <h3 className="mt-4 text-lg font-semibold">
                {f.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="bg-[var(--cream)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            center
            eyebrow="How It Works"
            title="Four steps to a home-cooked meal"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="card-soft relative p-6"
              >
                <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-border">
                  0{i + 1}
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon size={20} />
                </span>

                <h3 className="mt-4 text-lg font-semibold">
                  {s.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Featured dishes ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured"
            title="Loved in kitchens near you"
            subtitle="The highest rated dishes on RasoiHub this week."
          />

          <Link
            to="/explore"
            search={{ q: "", category: "All" }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Explore all food <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
            />
          ))}
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="bg-[var(--cream)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            center
            eyebrow="Testimonials"
            title="What our customers say"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="card-soft flex flex-col gap-4 p-7"
              >
                <Quote size={26} className="text-primary" />

                <blockquote className="text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </blockquote>

                <figcaption className="mt-auto">
                  <p className="text-sm font-semibold">
                    {t.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {t.city}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Chef CTA ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="card-soft flex flex-col items-center gap-6 bg-primary px-8 py-14 text-center text-primary-foreground">
          <ChefHat size={34} />

          <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
            Cook from home? Turn your kitchen into an income.
          </h2>

          <p className="max-w-xl text-sm opacity-90">
            Register as a home chef, list your dishes with your own photos and
            start receiving orders from your neighbourhood today.
          </p>

          <Link
            to="/register"
            className="rounded-full bg-card px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-105"
          >
            Become a Home Chef
          </Link>
        </div>
      </section>
    </div>
  );
}