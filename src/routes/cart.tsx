import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { EmptyState, PageShell, SectionHeading } from "@/components/ui-kit";
import { formatINR, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — RasoiHub" },
      { name: "description", content: "Review your homemade food selection before checkout." },
      { property: "og:title", content: "Your Cart — RasoiHub" },
      { property: "og:description", content: "Review your homemade food selection before checkout." },
    ],
  }),
  component: CartPage,
});

const DELIVERY_FEE = 29;

function CartPage() {
  const { cartDetails, cartTotal, setCartQuantity, removeFromCart, getChef } = useStore();

  if (!cartDetails.length) {
    return (
      <PageShell>
        <EmptyState
          icon={<ShoppingBag size={24} />}
          title="Your cart is empty"
          description="Browse home kitchens near you and add a dish to get started."
          action={
            <Link
              to="/explore"
              search={{ q: "", category: "All" }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore Food
            </Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SectionHeading eyebrow="Your Cart" title="Almost at your table" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {cartDetails.map(({ item, dish }) => {
            const chef = getChef(dish.chefId);
            return (
              <div key={dish.id} className="card-soft flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="h-24 w-full rounded-xl object-cover sm:w-28"
                />
                <div className="flex-1">
                  <p className="font-semibold">{dish.name}</p>
                  <p className="text-sm text-muted-foreground">by {chef?.name ?? "Home chef"}</p>
                  <p className="mt-1 text-sm font-medium">{formatINR(dish.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-border p-1">
                    <button
                      onClick={() => setCartQuantity(dish.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setCartQuantity(dish.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="w-20 text-right font-semibold">
                    {formatINR(dish.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(dish.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                    aria-label={`Remove ${dish.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card-soft h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Item total</dt>
              <dd className="font-medium">{formatINR(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-medium">{formatINR(DELIVERY_FEE)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-semibold">To pay</dt>
              <dd className="font-semibold">{formatINR(cartTotal + DELIVERY_FEE)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Proceed to Checkout
          </Link>
          <Link
            to="/explore"
            search={{ q: "", category: "All" }}
            className="mt-3 block rounded-full border border-border px-5 py-2.5 text-center text-sm font-semibold hover:bg-secondary"
          >
            Add more dishes
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}
