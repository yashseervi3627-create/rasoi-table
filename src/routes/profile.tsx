import { createFileRoute, Link } from "@tanstack/react-router";
import { User, ShoppingBag, LogOut } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const savedUser = localStorage.getItem("rasoihubUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <User className="mx-auto mb-4" size={48} />

          <h1 className="text-2xl font-bold mb-2">
            You are not logged in
          </h1>

          <p className="text-gray-500 mb-6">
            Please sign in to view your profile.
          </p>

          <Link
            to="/login"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="bg-orange-600 text-white p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-orange-600">
                <User size={32} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  {user.name}
                </h1>

                <p className="opacity-90 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">

            <h2 className="text-xl font-semibold mb-6">
              Profile Information
            </h2>

            <div className="space-y-5">

              <div>
                <p className="text-sm text-gray-500">
                  Full Name
                </p>

                <p className="font-medium text-lg">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-medium text-lg">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Account Type
                </p>

                <p className="font-medium text-lg capitalize">
                  {user.role}
                </p>
              </div>

            </div>

            <div className="border-t border-gray-200 mt-8 pt-6 flex flex-wrap gap-3">

              <Link
                to="/orders"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-100"
              >
                <ShoppingBag size={18} />
                My Orders
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("rasoihubUser");
                  window.location.href = "/";
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-5 py-3 font-medium hover:bg-red-700"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}