import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OrderProgress } from "@/components/OrderProgress";
import {
  Button,
  EmptyState,
  Field,
  PageShell,
  SectionHeading,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import { createOrder } from "@/lib/api";
import { formatINR, useStore } from "@/lib/store";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      {
        title: "Checkout — RasoiHub",
      },
      {
        name: "description",
        content:
          "Review your homemade food order and confirm it.",
      },
      {
        property: "og:title",
        content: "Checkout — RasoiHub",
      },
      {
        property: "og:description",
        content:
          "Review your order and confirm your purchase.",
      },
    ],
  }),

  component: CheckoutPage,
});

function CheckoutPage() {
  const {
    cartDetails,
    cartTotal,
    placeOrder,
  } = useStore();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [confirmed, setConfirmed] =
    useState<Order | null>(null);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const savedUser =
      localStorage.getItem("rasoihubUser");

    if (!savedUser) {
      toast.error(
        "Please sign in before placing your order.",
      );

      navigate({
        to: "/login",
      });

      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      toast.error(
        "Please login again before placing your order.",
      );

      navigate({
        to: "/login",
      });

      return;
    }

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!form.address.trim()) {
      toast.error("Please enter your address.");
      return;
    }

    if (!cartDetails.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      // Send the order to MySQL.
      // There is NO delivery fee.
      const result = await createOrder({
        customer_id: Number(user.id),

        total_amount: Number(cartTotal),

        delivery_address:
          `${form.name}, ${form.phone}, ${form.address}`,

        items: cartDetails.map(
          ({ item, dish }) => ({
            food_id: Number(dish.id),
            quantity: Number(item.quantity),
            price: Number(dish.price),
          }),
        ),
      });

      console.log(
        "MySQL order created:",
        result.orderId,
      );

      // Keep the existing frontend confirmation screen.
      const localOrder = placeOrder(form);

      if (!localOrder) {
        toast.error(
          "Unable to create local order.",
        );
        return;
      }

      setConfirmed(localOrder);

      toast.success(
        "Order placed! Your chef has been notified.",
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to place order",
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  // Confirmation screen
  if (confirmed) {
    return (
      <PageShell className="max-w-3xl">
        <div className="card-soft p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-[var(--sage)]">
            <CheckCircle2 size={32} />
          </span>

          <h1 className="mt-5 text-3xl font-semibold">
            Order confirmed
          </h1>

          <p className="mt-2 text-muted-foreground">
            Thank you{" "}
            {confirmed.customer.name}! Your order{" "}
            <strong>{confirmed.id}</strong> has been
            sent to the kitchen.
          </p>

          <div className="mt-8 rounded-2xl bg-secondary p-5">
            <OrderProgress
              status={confirmed.status}
            />
          </div>

          <ul className="mt-8 space-y-3 text-left">
            {confirmed.items.map((item) => (
              <li
                key={item.dishId}
                className="flex items-center gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-lg object-cover"
                />

                <span className="flex-1 text-sm">
                  {item.name} × {item.quantity}
                </span>

                <span className="text-sm font-semibold">
                  {formatINR(
                    item.price *
                      item.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total paid</span>

            <span>
              {formatINR(confirmed.total)}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() =>
                navigate({
                  to: "/orders",
                })
              }
            >
              Track my order
            </Button>

            <Link
              to="/explore"
              search={{
                q: "",
                category: "All",
              }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Order something else
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // Empty cart
  if (!cartDetails.length) {
    return (
      <PageShell>
        <EmptyState
          icon={<ShoppingBag size={24} />}
          title="Nothing to check out"
          description="Add a dish to your cart first, then come back to place your order."
          action={
            <Link
              to="/explore"
              search={{
                q: "",
                category: "All",
              }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore Food
            </Link>
          }
        />
      </PageShell>
    );
  }

  // Checkout form
  return (
    <PageShell>
      <SectionHeading
        eyebrow="Checkout"
        title="Confirm your order"
        subtitle="Enter your details and place your homemade food order."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <form
          onSubmit={handleSubmit}
          className="card-soft space-y-5 p-6"
        >
          <Field label="Full Name">
            <TextInput
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Your name"
            />
          </Field>

          <Field label="Phone Number">
            <TextInput
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              placeholder="98765 43210"
              inputMode="tel"
            />
          </Field>

          <Field
            label="Address"
            hint="Enter your address for the order."
          >
            <TextArea
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              placeholder="Your address"
            />
          </Field>

          <p className="rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
            This is a demo checkout. No delivery fee is
            charged.
          </p>

          <Button
            type="submit"
            className="w-full"
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing Order..."
              : `Place Order · ${formatINR(
                  cartTotal,
                )}`}
          </Button>
        </form>

        <aside className="card-soft h-fit p-6">
          <h2 className="text-lg font-semibold">
            Your order
          </h2>

          <ul className="mt-4 space-y-3">
            {cartDetails.map(
              ({ item, dish }) => (
                <li
                  key={dish.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {dish.name} × {item.quantity}
                  </span>

                  <span className="font-medium">
                    {formatINR(
                      dish.price *
                        item.quantity,
                    )}
                  </span>
                </li>
              ),
            )}
          </ul>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>

              <span>
                {formatINR(cartTotal)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}