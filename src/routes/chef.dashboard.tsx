import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  LogOut,
  Plus,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChefGate } from "@/components/ChefGate";
import {
  Button,
  PageShell,
  SectionHeading,
} from "@/components/ui-kit";
import {
  getChefFoods,
  getChefOrders,
} from "@/lib/api";

type OrderStatus =
  | "Placed"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

type ChefOrder = {
  order_id: number;
  customer_id: number;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string | null;
  created_at: string;
};

export const Route = createFileRoute("/chef/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Chef Dashboard — RasoiHub",
      },
      {
        name: "description",
        content:
          "Your kitchen at a glance: dishes, active orders and completed orders.",
      },
      {
        property: "og:title",
        content: "Chef Dashboard — RasoiHub",
      },
      {
        property: "og:description",
        content:
          "Manage your home kitchen on RasoiHub.",
      },
    ],
  }),

  component: () => (
    <ChefGate>
      {(chef) => (
        <Dashboard
          chefId={Number(chef.id)}
          chefName={chef.name}
        />
      )}
    </ChefGate>
  ),
});

function Dashboard({
  chefId,
  chefName,
}: {
  chefId: number;
  chefName: string;
}) {
  const [foodCount, setFoodCount] = useState(0);
  const [orders, setOrders] = useState<ChefOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("rasoihubUser");
    window.dispatchEvent(new Event("rasoihub-auth"));
    window.location.href = "/login";
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [foodResult, orderResult] =
          await Promise.all([
            getChefFoods(chefId),
            getChefOrders(chefId),
          ]);

        setFoodCount(
          Array.isArray(foodResult.foods)
            ? foodResult.foods.length
            : 0,
        );

        const rawOrders =
          Array.isArray(orderResult.orders)
            ? orderResult.orders
            : [];

        const uniqueOrders = new Map<
          number,
          ChefOrder
        >();

        rawOrders.forEach((item: ChefOrder) => {
          if (!uniqueOrders.has(item.order_id)) {
            uniqueOrders.set(item.order_id, {
              order_id: item.order_id,
              customer_id: item.customer_id,
              customer_name: item.customer_name,
              total_amount: Number(
                item.total_amount,
              ),
              status: item.status,
              delivery_address:
                item.delivery_address,
              created_at: item.created_at,
            });
          }
        });

        setOrders(
          Array.from(uniqueOrders.values()),
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [chefId]);

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "Completed" &&
      order.status !== "Cancelled",
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  );

  const earnings = completedOrders.reduce(
    (total, order) =>
      total + Number(order.total_amount),
    0,
  );

  const stats = [
    {
      label: "Total Food Items",
      value: foodCount,
      icon: UtensilsCrossed,
    },
    {
      label: "Active Orders",
      value: activeOrders.length,
      icon: ClipboardList,
    },
    {
      label: "Completed Orders",
      value: completedOrders.length,
      icon: ClipboardList,
    },
    {
      label: "Average Rating",
      value: "—",
      icon: Star,
    },
  ];

  if (loading) {
    return (
      <PageShell>
        <div className="py-16 text-center text-muted-foreground">
          Loading your chef dashboard...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">
            Chef Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-semibold">
            Welcome back, {chefName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your kitchen and customer orders.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={logout}
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="card-soft p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={18} />
              </span>

              <p className="mt-4 text-3xl font-semibold">
                {stat.value}
              </p>

              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/chef/add-food"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={16} />
          Add a new dish
        </Link>

        <Link
          to="/chef/menu"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          Manage my menu
        </Link>

        <Link
          to="/chef/orders"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          View customer orders
        </Link>
      </div>

      {/* Recent Orders */}
      <section className="mt-12">
        <SectionHeading
          eyebrow="Recent Activity"
          title="What's happening in your kitchen"
          subtitle="Your latest customer orders."
        />

        <div className="mt-6 space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.order_id}
              className="card-soft flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div>
                <p className="font-semibold">
                  Order #{order.order_id}
                </p>

                <p className="text-sm text-muted-foreground">
                  Customer: {order.customer_name}
                </p>

                {order.delivery_address && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.delivery_address}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                  {order.status}
                </span>

                <span className="font-semibold">
                  ₹
                  {Number(
                    order.total_amount,
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No orders yet. Add dishes to your menu so
              customers can find your kitchen.
            </p>
          )}
        </div>

        {/* Earnings */}
        {completedOrders.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Lifetime earnings from completed orders:{" "}
            <strong>
              ₹{earnings.toFixed(2)}
            </strong>
          </p>
        )}
      </section>
    </PageShell>
  );
}