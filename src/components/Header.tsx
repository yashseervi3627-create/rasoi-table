import { Link } from "@tanstack/react-router";
import {
  Menu,
  ShoppingBag,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useStore } from "@/lib/store";

const customerLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Food" },
  { to: "/orders", label: "My Orders" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
] as const;

const chefLinks = [
  { to: "/chef/dashboard", label: "Dashboard" },
  { to: "/chef/add-food", label: "Add Food" },
  { to: "/chef/menu", label: "My Menu" },
  { to: "/chef/orders", label: "Orders" },
] as const;

export function Header() {
  const { state, cartCount } = useStore();

  const [open, setOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const updateUser = () => {
      const savedUser = localStorage.getItem("rasoihubUser");

      if (savedUser) {
        setLoggedInUser(JSON.parse(savedUser));
      } else {
        setLoggedInUser(null);
      }
    };

    updateUser();

    window.addEventListener("rasoihub-auth", updateUser);

    return () => {
      window.removeEventListener("rasoihub-auth", updateUser);
    };
  }, []);

  // Navigation is now based on the actual logged-in account.
  const isChef = loggedInUser?.role === "chef";

  const links = isChef ? chefLinks : customerLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed size={18} />
          </span>

          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight">
              RasoiHub
            </span>

            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Home Kitchens to Your Table
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{
                className: "bg-secondary text-secondary-foreground",
              }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">

          {/* Profile / Sign In */}
          {loggedInUser ? (
            <Link
              to="/profile"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:shadow-sm"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <User size={15} />
              </span>

              <span className="max-w-24 truncate">
                {loggedInUser.name}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:shadow-sm"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User size={15} />
              </span>

              Sign In
            </Link>
          )}

          {/* Cart - customer only */}
          {!isChef && (
            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card lg:hidden"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}

            {loggedInUser ? (
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                <span className="flex items-center gap-2">
                  <User size={17} />
                  My Profile
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                <span className="flex items-center gap-2">
                  <User size={17} />
                  Sign In
                </span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}