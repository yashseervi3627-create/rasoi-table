import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { OrderProgress } from "@/components/OrderProgress";
import { StarPicker } from "@/components/StarRating";
import {
  Button,
  EmptyState,
  PageShell,
  SectionHeading,
  TextArea,
} from "@/components/ui-kit";
import {
  submitReview,
} from "@/lib/api";
import { formatINR, useStore } from "@/lib/store";
import {
  type Order,
  type OrderStatus,
} from "@/lib/types";

type BackendOrderStatus =
  | "Placed"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

type ApiOrderItem = {
  order_id: number;
  customer_id: number;
  total_amount: number;
  status: BackendOrderStatus;
  delivery_address: string | null;
  created_at: string;
  item_id: number;
  food_id: number;
  quantity: number;
  item_price: number;
  food_name: string;
  image_url: string | null;
  chef_id: number;
};

const BACKEND_TO_UI_STATUS: Record<
  BackendOrderStatus,
  OrderStatus
> = {
  Placed: "Order Placed",
  Accepted: "Order Accepted",
  Preparing: "Preparing",
  Ready: "Ready",
  Completed: "Completed",
  Cancelled: "Completed",
};

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      {
        title: "My Orders — RasoiHub",
      },
      {
        name: "description",
        content:
          "Track your homemade food orders live and rate completed meals.",
      },
      {
        property: "og:title",
        content: "My Orders — RasoiHub",
      },
      {
        property: "og:description",
        content:
          "Track your orders live and rate completed meals.",
      },
    ],
  }),

  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const storedUser =
        localStorage.getItem("rasoihubUser");

      if (!storedUser) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "customer") {
        setOrders([]);
        setLoading(false);
        return;
      }

      const customerId = Number(user.id);

      if (!customerId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/customer/${customerId}`,
      );

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error(
          "Customer orders returned non-JSON:",
          text,
        );

        throw new Error(
          "Backend returned an invalid response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load customer orders",
        );
      }

      const rawOrders =
        (result.orders || []) as ApiOrderItem[];

      const grouped: Record<number, Order> = {};

      rawOrders.forEach((item) => {
        if (!grouped[item.order_id]) {
          grouped[item.order_id] = {
            id: String(item.order_id),
            items: [],
            customer: {
              name: user.name || "Customer",
              phone: "",
              address:
                item.delivery_address ||
                "Address not provided",
            },
            total: Number(item.total_amount),
            status:
              BACKEND_TO_UI_STATUS[item.status],
            placedAt: item.created_at,
            reviewed: false,
          };
        }

        const currentOrder =
          grouped[item.order_id];

        if (!currentOrder) {
          return;
        }

        currentOrder.items.push({
          dishId: String(item.food_id),
          chefId: String(item.chef_id),
          name: item.food_name,
          image: item.image_url || "",
          price: Number(item.item_price),
          quantity: Number(item.quantity),
        });
      });

      setOrders(Object.values(grouped));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load your orders",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <PageShell>
      <SectionHeading
        eyebrow="My Orders"
        title="Track every step of your meal"
        subtitle="Your chef updates each stage as your food is cooked, so this page shows the latest status."
      />

      {loading ? (
        <div className="mt-8 py-16 text-center text-muted-foreground">
          Loading your orders...
        </div>
      ) : orders.length ? (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={<PackageSearch size={24} />}
            title="No orders yet"
            description="Once you place an order it will appear here with a live progress tracker."
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
        </div>
      )}
    </PageShell>
  );
}

function OrderCard({
  order,
}: {
  order: Order;
}) {
  const { addReview } = useStore();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  async function submitReviewForOrder() {
    if (!comment.trim()) {
      toast.error(
        "Please add a short comment with your rating.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const storedUser =
        localStorage.getItem("rasoihubUser");

      if (!storedUser) {
        toast.error(
          "Please login again before submitting a review.",
        );
        return;
      }

      const user = JSON.parse(storedUser);

      const customerId = Number(user.id);

      if (!customerId) {
        toast.error(
          "Customer account information is missing.",
        );
        return;
      }

      // Save the review to MySQL for every food
      // item in this completed order.
      for (const item of order.items) {
        await submitReview({
          customer_id: customerId,
          food_id: Number(item.dishId),
          rating,
          comment: comment.trim(),
        });

        // Also update the local store so the
        // existing UI remains in sync.
        addReview({
          dishId: item.dishId,
          chefId: item.chefId,
          orderId: order.id,
          customerName:
            order.customer.name,
          rating,
          comment: comment.trim(),
        });
      }

      toast.success(
        "Thanks for your feedback!",
      );

      setComment("");

      // Refresh orders after successful review.
      await loadOrdersAfterReview();
    } catch (error) {
      console.error(
        "Review submission error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function loadOrdersAfterReview() {
    try {
      const storedUser =
        localStorage.getItem("rasoihubUser");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);
      const customerId = Number(user.id);

      if (!customerId) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/customer/${customerId}`,
      );

      if (!response.ok) {
        return;
      }

      // We don't need to replace the current
      // order data here. This simply confirms
      // the backend is reachable after review.
      await response.json();
    } catch {
      // Ignore refresh errors here.
    }
  }

  return (
    <article className="card-soft p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            Order #{order.id}
          </p>

          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(
              order.placedAt,
            ).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
          {order.status}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-secondary p-5">
        <OrderProgress
          status={order.status}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {order.items.map((item) => (
          <li
            key={item.dishId}
            className="flex items-center gap-3"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-secondary" />
            )}

            <span className="flex-1 text-sm">
              {item.name} × {item.quantity}
            </span>

            <span className="text-sm font-semibold">
              {formatINR(
                item.price * item.quantity,
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">
          Delivering to{" "}
          {order.customer.address}
        </span>

        <span className="font-semibold">
          {formatINR(order.total)}
        </span>
      </div>

      {order.status === "Completed" &&
        !order.reviewed && (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-5">
            <p className="font-semibold">
              How was your meal?
            </p>

            <div className="mt-3">
              <StarPicker
                value={rating}
                onChange={setRating}
              />
            </div>

            <TextArea
              className="mt-3"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Tell other customers what you thought of the food…"
            />

            <Button
              className="mt-3"
              onClick={submitReviewForOrder}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </Button>
          </div>
        )}

      {order.reviewed && (
        <p className="mt-4 text-sm text-[var(--sage)]">
          Thanks — your review is live on the dish page.
        </p>
      )}
    </article>
  );
}