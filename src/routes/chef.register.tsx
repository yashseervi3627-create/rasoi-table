import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChefHat, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Field,
  PageShell,
  SectionHeading,
  TextArea,
  TextInput,
} from "@/components/ui-kit";

import { registerUser } from "@/lib/api";

export const Route = createFileRoute("/chef/register")({
  head: () => ({
    meta: [
      { title: "Become a Home Chef — RasoiHub" },
      {
        name: "description",
        content:
          "Register your home kitchen on RasoiHub, list your dishes and start receiving orders from your neighbourhood.",
      },
      {
        property: "og:title",
        content: "Become a Home Chef — RasoiHub",
      },
      {
        property: "og:description",
        content:
          "Register your home kitchen and start receiving orders.",
      },
    ],
  }),
  component: ChefRegisterPage,
});

function ChefRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
    location: "",
    bio: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((f) => ({
        ...f,
        photo: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.specialty.trim() ||
      !form.location.trim()
    ) {
      toast.error(
        "Name, email, password, specialty and location are required.",
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "chef",
      });

      toast.success(
        `Chef account created successfully for ${form.name}!`,
      );

      navigate({
        to: "/login",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Chef registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell className="max-w-4xl">
      <SectionHeading
        eyebrow="Become a Chef"
        title="Turn your kitchen into a business"
        subtitle="Create your chef account. You can add dishes straight after signing up."
      />

      <form
        onSubmit={handleSubmit}
        className="card-soft mt-8 grid gap-5 p-6 sm:grid-cols-2"
      >
        {/* Chef Name */}
        <Field label="Chef Name">
          <TextInput
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Meera Sharma"
          />
        </Field>

        {/* Email */}
        <Field label="Email">
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="meera@example.com"
          />
        </Field>

        {/* Password */}
        <Field label="Password">
          <TextInput
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            placeholder="Create a password"
          />
        </Field>

        {/* Specialty */}
        <Field label="Specialty">
          <TextInput
            value={form.specialty}
            onChange={(e) =>
              setForm({
                ...form,
                specialty: e.target.value,
              })
            }
            placeholder="North Indian home cooking"
          />
        </Field>

        {/* Experience */}
        <Field label="Experience">
          <TextInput
            value={form.experience}
            onChange={(e) =>
              setForm({
                ...form,
                experience: e.target.value,
              })
            }
            placeholder="6 years"
          />
        </Field>

        {/* Location */}
        <Field label="Location">
          <TextInput
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            placeholder="Bangalore, Karnataka"
          />
        </Field>

        {/* Bio */}
        <div className="sm:col-span-2">
          <Field label="Short Bio">
            <TextArea
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
              placeholder="Tell customers what makes your food special…"
            />
          </Field>
        </div>

        {/* Profile Photo */}
        <div className="sm:col-span-2">
          <Field label="Profile Photo">
            <div className="flex items-center gap-4">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Chef preview"
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <ChefHat size={24} />
                </span>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
                <Upload size={16} />
                Upload photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
              </label>
            </div>
          </Field>
        </div>

        {/* Create Account */}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating Chef Account..."
              : "Create Chef Account"}
          </Button>
        </div>
      </form>

      {/* Existing Account */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have a chef account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </PageShell>
  );
}