import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Pencil,
  Save,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ChefGate } from "@/components/ChefGate";
import {
  Button,
  EmptyState,
  Field,
  PageShell,
  SectionHeading,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import {
  deleteFood,
  getChefFoods,
  updateFood,
} from "@/lib/api";

type Food = {
  id: number;
  chef_id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  is_available: boolean;
};

type EditForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  is_available: boolean;
};

export const Route = createFileRoute("/chef/menu")({
  head: () => ({
    meta: [
      { title: "My Menu — RasoiHub Chef" },
      {
        name: "description",
        content: "Manage the dishes on your RasoiHub menu.",
      },
      {
        property: "og:title",
        content: "My Menu — RasoiHub Chef",
      },
      {
        property: "og:description",
        content: "Manage the dishes on your RasoiHub menu.",
      },
    ],
  }),

  component: () => (
    <ChefGate>
      {(chef) => <MyMenu chefId={chef.id} />}
    </ChefGate>
  ),
});

function MyMenu({ chefId }: { chefId: string }) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingFoodId, setEditingFoodId] =
    useState<number | null>(null);

  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_available: true,
  });

  const [saving, setSaving] = useState(false);

  async function loadFoods() {
    try {
      setLoading(true);

      const result = await getChefFoods(Number(chefId));

      setFoods(result.foods || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load your menu",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, [chefId]);

  function startEditing(food: Food) {
    setEditingFoodId(food.id);

    setEditForm({
      name: food.name,
      description: food.description || "",
      price: String(food.price),
      category: food.category || "",
      image_url: food.image_url || "",
      is_available: Boolean(food.is_available),
    });
  }

  function cancelEditing() {
    setEditingFoodId(null);

    setEditForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      is_available: true,
    });
  }

  async function handleSave(foodId: number) {
    if (!editForm.name.trim()) {
      toast.error("Please enter the food name.");
      return;
    }

    if (!editForm.price || Number(editForm.price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);

      await updateFood({
        id: foodId,
        chef_id: Number(chefId),
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price: Number(editForm.price),
        category: editForm.category.trim(),
        image_url: editForm.image_url.trim(),
        is_available: editForm.is_available,
      });

      setFoods((currentFoods) =>
        currentFoods.map((food) =>
          food.id === foodId
            ? {
                ...food,
                name: editForm.name.trim(),
                description:
                  editForm.description.trim() || null,
                price: Number(editForm.price),
                category:
                  editForm.category.trim() || null,
                image_url:
                  editForm.image_url.trim() || null,
                is_available: editForm.is_available,
              }
            : food,
        ),
      );

      toast.success("Dish updated successfully!");

      cancelEditing();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update food",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    foodId: number,
    foodName: string,
  ) {
    try {
      await deleteFood(foodId, Number(chefId));

      setFoods((currentFoods) =>
        currentFoods.filter(
          (food) => food.id !== foodId,
        ),
      );

      toast.success(
        `${foodName} removed from your menu`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete food",
      );
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="py-16 text-center text-muted-foreground">
          Loading your menu...
        </div>
      </PageShell>
    );
  }

  if (!foods.length) {
    return (
      <PageShell>
        <EmptyState
          icon={<UtensilsCrossed size={24} />}
          title="Your menu is empty"
          description="Add your first dish and it will appear here for customers to order."
          action={
            <Link
              to="/chef/add-food"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Add Food
            </Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="My Menu"
          title={`${foods.length} ${
            foods.length === 1 ? "dish" : "dishes"
          } on your menu`}
        />

        <Link
          to="/chef/add-food"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Add Food
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => {
          const isEditing =
            editingFoodId === food.id;

          return (
            <div
              key={food.id}
              className="card-soft overflow-hidden"
            >
              {food.image_url ? (
                <img
                  src={
                    isEditing
                      ? editForm.image_url || food.image_url
                      : food.image_url
                  }
                  alt={food.name}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-secondary text-primary">
                  <UtensilsCrossed size={36} />
                </div>
              )}

              <div className="space-y-4 p-5">
                {!isEditing ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {food.category && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {food.category}
                          </span>
                        )}

                        <h3 className="text-lg font-semibold">
                          {food.name}
                        </h3>
                      </div>

                      <span className="font-semibold">
                        ₹
                        {Number(
                          food.price,
                        ).toFixed(2)}
                      </span>
                    </div>

                    {food.description && (
                      <p className="text-sm text-muted-foreground">
                        {food.description}
                      </p>
                    )}

                    <p className="text-sm">
                      {food.is_available ? (
                        <span className="font-medium text-green-600">
                          Available
                        </span>
                      ) : (
                        <span className="font-medium text-red-600">
                          Unavailable
                        </span>
                      )}
                    </p>

                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          startEditing(food)
                        }
                      >
                        <Pencil size={15} />
                        Edit Dish
                      </Button>

                      <Button
                        variant="danger"
                        className="flex-1"
                        onClick={() =>
                          handleDelete(
                            food.id,
                            food.name,
                          )
                        }
                      >
                        <Trash2 size={15} />
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Edit Dish
                      </h3>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                        aria-label="Cancel editing"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <Field label="Food Name">
                      <TextInput
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Food name"
                      />
                    </Field>

                    <Field label="Description">
                      <TextArea
                        value={
                          editForm.description
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description:
                              e.target.value,
                          })
                        }
                        placeholder="Describe your dish"
                      />
                    </Field>

                    <Field label="Price">
                      <TextInput
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: e.target.value,
                          })
                        }
                        placeholder="120"
                        inputMode="decimal"
                      />
                    </Field>

                    <Field label="Category">
                      <TextInput
                        value={
                          editForm.category
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category:
                              e.target.value,
                          })
                        }
                        placeholder="South Indian"
                      />
                    </Field>

                    <Field label="Image URL">
                      <TextInput
                        value={
                          editForm.image_url
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            image_url:
                              e.target.value,
                          })
                        }
                        placeholder="Image URL"
                      />
                    </Field>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                      <input
                        type="checkbox"
                        checked={
                          editForm.is_available
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            is_available:
                              e.target.checked,
                          })
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-medium">
                        Available for customers
                      </span>
                    </label>

                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={cancelEditing}
                        disabled={saving}
                      >
                        <X size={15} />
                        Cancel
                      </Button>

                      <Button
                        className="flex-1"
                        onClick={() =>
                          handleSave(food.id)
                        }
                        disabled={saving}
                      >
                        <Save size={15} />
                        {saving
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}