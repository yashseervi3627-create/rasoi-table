import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { registerUser } from "../lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "chef">("customer");

  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "chef") {
      if (!specialty.trim() || !location.trim()) {
        setError("Please enter your specialty and location.");
        return;
      }
    }

    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        role,
        specialty,
        experience,
        location,
        bio,
      });

      alert(
        role === "chef"
          ? "Chef account created successfully!"
          : "Registration successful!",
      );

      navigate({
        to: "/login",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Your RasoiHub Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Join RasoiHub as a customer or home chef
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basic Account Information */}
          <div>
            <label className="block mb-1 font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block mb-1 font-medium">
              I am joining as
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "customer" | "chef")
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="customer">Customer</option>
              <option value="chef">Home Chef</option>
            </select>
          </div>

          {/* Chef Information */}
          {role === "chef" && (
            <div className="border-t border-gray-200 pt-5 mt-2">
              <h2 className="text-xl font-semibold mb-1">
                Tell us about your kitchen
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Help customers learn more about your home kitchen.
              </p>

              <div className="space-y-4">

                {/* Specialty */}
                <div>
                  <label className="block mb-1 font-medium">
                    Specialty
                  </label>

                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="South Indian, North Indian, Desserts..."
                    required={role === "chef"}
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block mb-1 font-medium">
                    Experience
                  </label>

                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="5 years"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-1 font-medium">
                    Location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore, Karnataka"
                    required={role === "chef"}
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block mb-1 font-medium">
                    Short Bio
                  </label>

                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell customers what makes your food special..."
                    rows={4}
                    className="w-full border rounded-lg px-4 py-3 resize-none"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : role === "chef"
                ? "Create Chef Account"
                : "Create Customer Account"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}