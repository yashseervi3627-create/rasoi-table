import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChefGate } from "@/components/ChefGate";
import {
  Button,
  Field,
  PageShell,
  SectionHeading,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import { addFood } from "@/lib/api";
import { CATEGORIES, type Category } from "@/lib/types";

export const Route = createFileRoute("/chef/add-food")({
  head: () => ({
    meta: [
      { title: "Add Food — RasoiHub Chef" },
      {
        name: "description",
        content:
          "List a new dish with your own photo, price in rupees, prep time and daily quantity.",
      },
      {
        property: "og:title",
        content: "Add Food — RasoiHub Chef",
      },
      {
        property: "og:description",
        content: "List a new dish on your RasoiHub menu.",
      },
    ],
  }),
  component: () => (
    <ChefGate>{(chef) => <AddFood chefId={chef.id} />}</ChefGate>
  ),
});

function AddFood({ chefId }: { chefId: string }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    category: "Lunch" as Category,
    price: "",
    prepTime: "",
    quantity: "",
    image: "",
  });

  // Food image upload
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((f) => ({
        ...f,
        image: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.image) {
      toast.error("Food name, price and a food photo are required.");
      return;
    }

    try {
      await addFood({
        chef_id: Number(chefId),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image_url: form.image,
      });

      toast.success(`${form.name} is now live on your menu`);

      navigate({
        to: "/chef/menu",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add food",
      );
    }
  }

  return (
    <PageShell className="max-w-4xl">
      <SectionHeading
        eyebrow="Add Food"
        title="List a new dish"
        subtitle="A clear photo and honest description get the most orders."
      />

      <form
        onSubmit={handleSubmit}
        className="card-soft mt-8 grid gap-5 p-6 sm:grid-cols-2"
      >
        {/* Food Name */}
        <Field label="Food Name">
          <TextInput
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Rajma Chawal"
          />
        </Field>

        {/* Category */}
        <Field label="Category">
          <Select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as Category,
              })
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        {/* Description */}
        <div className="sm:col-span-2">
          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Slow-cooked kidney beans served with steamed rice…"
            />
          </Field>
        </div>

        {/* Ingredients */}
        <div className="sm:col-span-2">
          <Field
            label="Ingredients"
            hint="Separate each ingredient with a comma."
          >
            <TextInput
              value={form.ingredients}
              onChange={(e) =>
                setForm({
                  ...form,
                  ingredients: e.target.value,
                })
              }
              placeholder="Kidney beans, Onion, Tomato, Ghee"
            />
          </Field>
        </div>

        {/* Price */}
        <Field label="Price (₹)">
          <TextInput
            type="number"
            min="1"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            placeholder="180"
          />
        </Field>

        {/* Preparation Time */}
        <Field label="Preparation Time">
          <TextInput
            value={form.prepTime}
            onChange={(e) =>
              setForm({
                ...form,
                prepTime: e.target.value,
              })
            }
            placeholder="40 mins"
          />
        </Field>

        {/* Available Quantity */}
        <Field label="Available Quantity">
          <TextInput
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
            placeholder="10"
          />
        </Field>

        {/* Food Image */}
        <div className="sm:col-span-2">
          <Field label="Food Image">
            <div className="flex items-center gap-4">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-24 w-32 rounded-xl object-cover"
                />
              ) : (
                <span className="flex h-24 w-32 items-center justify-center rounded-xl bg-secondary text-primary">
                  <ImagePlus size={22} />
                </span>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
                <ImagePlus size={16} />
                Upload photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            </div>
          </Field>
        </div>

        {/* Submit */}
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full">
            Publish Dish
          </Button>
        </div>
      </form>
    </PageShell>
  );
}