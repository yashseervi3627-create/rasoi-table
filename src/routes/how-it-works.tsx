import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Search, ShoppingBag, Soup, Star, Truck, UtensilsCrossed } from "lucide-react";

import { PageShell, SectionHeading } from "@/components/ui-kit";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — RasoiHub" },
      {
        name: "description",
        content: "Four simple steps for customers and four for home chefs — from discovering a dish to a five-star review.",
      },
      { property: "og:title", content: "How It Works — RasoiHub" },
      { property: "og:description", content: "How ordering and cooking on RasoiHub works." },
    ],
  }),
  component: HowItWorksPage,
});

const CUSTOMER_STEPS = [
  { icon: Search, title: "Discover", text: "Search dishes, cuisines or chefs and filter by meal type." },
  { icon: ShoppingBag, title: "Order", text: "Add dishes to your cart and confirm with your delivery details." },
  { icon: Soup, title: "Chef Cooks", text: "The chef accepts and cooks your food fresh, updating each stage." },
  { icon: Star, title: "Rate", text: "Once completed, rate the dish and chef so others can order confidently." },
];

const CHEF_STEPS = [
  { icon: ChefHat, title: "Register", text: "Create your chef profile with specialty, experience and photo." },
  { icon: UtensilsCrossed, title: "Add Dishes", text: "Upload a photo, set the price in ₹, prep time and daily quantity." },
  { icon: Truck, title: "Manage Orders", text: "Advance each order: Accepted, Preparing, Ready and Completed." },
  { icon: Star, title: "Grow", text: "Collect reviews that build your rating and bring repeat customers." },
];

function HowItWorksPage() {
  return (
    <PageShell>
      <SectionHeading
        center
        eyebrow="How It Works"
        title="Simple for customers, simple for chefs"
        subtitle="RasoiHub keeps both sides of the kitchen door in sync — every status update a chef makes appears instantly on the customer's tracker."
      />

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">For customers</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_STEPS.map((s, i) => (
            <div key={s.title} className="card-soft relative p-6">
              <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-border">
                0{i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <s.icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">For home chefs</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHEF_STEPS.map((s, i) => (
            <div key={s.title} className="card-soft relative p-6">
              <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-border">
                0{i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          to="/explore"
          search={{ q: "", category: "All" }}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Start ordering
        </Link>
        <Link
          to="/chef/register"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          Become a chef
        </Link>
      </div>
    </PageShell>
  );
}
