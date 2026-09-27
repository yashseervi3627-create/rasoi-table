import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Home, Users } from "lucide-react";

import { PageShell, SectionHeading } from "@/components/ui-kit";
import heroImage from "@/assets/hero-kitchen.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — RasoiHub" },
      {
        name: "description",
        content:
          "RasoiHub is a home-food marketplace connecting verified home chefs with neighbours who want honest, freshly cooked meals.",
      },
      { property: "og:title", content: "About Us — RasoiHub" },
      { property: "og:description", content: "Why we built a marketplace for home kitchens." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Home, title: "Real kitchens", text: "Every dish is cooked at home, in small batches, by someone who eats the same food." },
  { icon: Users, title: "Fair to chefs", text: "Home chefs keep the majority of every order and set their own prices and timings." },
  { icon: Heart, title: "Honest food", text: "No preservatives, no reheated stock, no hidden kitchens — just food you can trace." },
];

function AboutPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="About Us"
        title="We started with one simple question"
        subtitle="Why is it so hard to buy the kind of food most of us actually want to eat every day?"
      />

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <img
          src={heroImage}
          alt="A home chef preparing a fresh meal"
          loading="lazy"
          className="w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
        />
        <div className="space-y-4 text-muted-foreground">
          <p>
            RasoiHub began as a small experiment between neighbours: one aunty cooking extra dal, a WhatsApp
            group, and a lot of very happy people. We turned that idea into a proper marketplace.
          </p>
          <p>
            Today home chefs across India use RasoiHub to list their dishes, manage orders and build a
            reputation with real customer reviews — while customers get food cooked by a person, not a
            production line.
          </p>
          <p>
            Every chef profile shows their specialty, experience and location. Every dish shows its
            ingredients, preparation time and honest ratings.
          </p>
          <Link
            to="/chef/register"
            className="inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Join as a Home Chef
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="card-soft p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <v.icon size={20} />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
