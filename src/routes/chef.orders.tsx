import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChefGate } from "@/components/ChefGate";
import { OrderProgress } from "@/components/OrderProgress";
import {
  Button,
  EmptyState,
  PageShell,
  SectionHeading,
} from "@/components/ui-kit";
import {
  ORDER_STATUSES,
  type OrderStatus,
} from "@/lib/types";
import {
  getChefOrders,
  updateOrderStatus,
} from "@/lib/api";

type BackendOrderStatus =
  | "Placed"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

type OrderItem = {
  item_id: number;
  food_id: number;
  quantity: number;
  item_price: number;
  food_name: string;
  image_url: string | null;
};

type Order = {
  order_id: number;
  customer_id: number;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string | null;
  created_at: string;
  items: OrderItem[];
};

type ApiOrderItem = {
  order_id: number;
  customer_id: number;
  customer_name: string;
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
};

/*
 * Backend status → status used by the existing
 * OrderProgress component.
 */
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

/*
 * UI status → status expected by the backend.
 */
const UI_TO_BACKEND_STATUS: Record<
  OrderStatus,
  BackendOrderStatus
> = {
  "Order Placed": "Placed",
  "Order Accepted": "Accepted",
  Preparing: "Preparing",
  Ready: "Ready",
  Completed: "Completed",
};

export const Route = createFileRoute("/chef/orders")({
  head: () => ({
    meta: [
      {
        title: "Customer Orders — RasoiHub Chef",
      },
      {
        name: "description",
        content:
          "Accept orders and advance each one through preparation.",
      },
      {
        property: "og:title",
        content: "Customer Orders — RasoiHub Chef",
      },
      {
        property: "og:description",
        content:
          "Manage incoming orders for your home kitchen.",
      },
    ],
  }),

  component: () => (
    <ChefGate>
      {(chef) => (
        <ChefOrders chefId={Number(chef.id)} />
      )}
    </ChefGate>
  ),
});

function ChefOrders({ chefId }: { chefId: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] =
    useState<number | null>(null);

  async function loadOrders() {
    try {
      setLoading(true);

      const result = await getChefOrders(chefId);

      const rawOrders =
        (result.orders || []) as ApiOrderItem[];

      const grouped: Record<number, Order> = {};

      rawOrders.forEach((item) => {
        if (!grouped[item.order_id]) {
          grouped[item.order_id] = {
            order_id: item.order_id,
            customer_id: item.customer_id,
            customer_name: item.customer_name,
            total_amount: Number(item.total_amount),
            status:
              BACKEND_TO_UI_STATUS[item.status],
            delivery_address: item.delivery_address,
            created_at: item.created_at,
            items: [],
          };
        }

        const currentOrder =
          grouped[item.order_id];

        if (!currentOrder) {
          return;
        }

        currentOrder.items.push({
          item_id: item.item_id,
          food_id: item.food_id,
          quantity: Number(item.quantity),
          item_price: Number(item.item_price),
          food_name: item.food_name,
          image_url: item.image_url,
        });
      });

      setOrders(Object.values(grouped));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [chefId]);

  async function handleStatusUpdate(
    orderId: number,
    nextStatus: OrderStatus,
  ) {
    try {
      setUpdatingOrderId(orderId);

      await updateOrderStatus({
        orderId,
        chefId,
        status: UI_TO_BACKEND_STATUS[nextStatus],
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                status: nextStatus,
              }
            : order,
        ),
      );

      toast.success(
        `Order #${orderId} marked as ${nextStatus}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="py-16 text-center text-muted-foreground">
          Loading customer orders...
        </div>
      </PageShell>
    );
  }

  if (orders.length === 0) {
    return (
      <PageShell>
        <EmptyState
          icon={<ClipboardList size={24} />}
          title="No customer orders yet"
          description="When a customer orders one of your dishes it will appear here."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Customer Orders"
        title="Move each order along"
        subtitle="Accept orders and update their preparation status."
      />

      <div className="mt-8 space-y-6">
        {orders.map((order) => {
          const currentIndex =
            ORDER_STATUSES.indexOf(order.status);

          let nextStatus: OrderStatus | null = null;

          if (
            currentIndex >= 0 &&
            currentIndex <
              ORDER_STATUSES.length - 1
          ) {
            nextStatus =
              ORDER_STATUSES[currentIndex + 1]!;
          }

          const isUpdating =
            updatingOrderId === order.order_id;

          return (
            <article
              key={order.order_id}
              className="card-soft p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Order #{order.order_id}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {order.customer_name}
                  </p>

                  {order.delivery_address && (
                    <p className="text-sm text-muted-foreground">
                      {order.delivery_address}
                    </p>
                  )}
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
                    key={item.item_id}
                    className="flex items-center gap-3"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.food_name}
                        loading="lazy"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-secondary" />
                    )}

                    <span className="flex-1 text-sm">
                      {item.food_name} × {item.quantity}
                    </span>

                    <span className="text-sm font-semibold">
                      ₹
                      {(
                        Number(item.item_price) *
                        Number(item.quantity)
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                <span className="font-semibold">
                  ₹
                  {Number(
                    order.total_amount,
                  ).toFixed(2)}
                </span>

                {nextStatus ? (
                  <Button
                    onClick={() =>
                      handleStatusUpdate(
                        order.order_id,
                        nextStatus,
                      )
                    }
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? "Updating..."
                      : `Mark as ${nextStatus}`}

                    {!isUpdating && (
                      <ArrowRight size={15} />
                    )}
                  </Button>
                ) : (
                  <span className="text-sm font-semibold text-[var(--sage)]">
                    Order completed
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}