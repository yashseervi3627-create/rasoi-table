import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, UtensilsCrossed } from "lucide-react";

/** Responsive site footer. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[var(--charcoal)] text-[var(--cream)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">

        {/* Brand & Contact */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UtensilsCrossed size={18} />
            </span>

            <span className="font-display text-xl font-semibold">
              RasoiHub
            </span>
          </div>

          <p className="mt-4 max-w-sm text-sm opacity-80">
            From Home Kitchens to Your Table. RasoiHub is a college project
            that connects customers with home chefs and homemade food.
          </p>

          <div className="mt-5 flex flex-col gap-2 text-sm opacity-80">

            <span className="inline-flex items-center gap-2">
              <MapPin size={15} />
              Bangalore, Karnataka, India
            </span>

            <span className="inline-flex items-center gap-2">
              <Phone size={15} />
              9380067962
            </span>

            <span className="inline-flex items-center gap-2">
              <Mail size={15} />
              project@rasoihub.in
            </span>

          </div>
        </div>

        {/* Customers */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">
            For Customers
          </h4>

          <ul className="mt-4 space-y-2 text-sm opacity-80">

            <li>
              <Link
                to="/explore"
                search={{ q: "", category: "All" }}
                className="hover:opacity-100 hover:underline"
              >
                Explore Food
              </Link>
            </li>

            <li>
              <Link to="/orders" className="hover:underline">
                My Orders
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:underline">
                Your Cart
              </Link>
            </li>

            <li>
              <Link to="/how-it-works" className="hover:underline">
                How It Works
              </Link>
            </li>

          </ul>
        </div>

        {/* Home Chefs */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">
            For Home Chefs
          </h4>

          <ul className="mt-4 space-y-2 text-sm opacity-80">

            <li>
              <Link to="/chef/register" className="hover:underline">
                Become a Chef
              </Link>
            </li>

            <li>
              <Link to="/chef/dashboard" className="hover:underline">
                Chef Dashboard
              </Link>
            </li>

            <li>
              <Link to="/chef/add-food" className="hover:underline">
                Add a Dish
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <span>
            © {new Date().getFullYear()} RasoiHub. BCA Student Project.
          </span>

          <span>
            Academic Project • 2026
          </span>

        </div>
      </div>
    </footer>
  );
}