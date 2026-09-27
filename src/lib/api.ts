const API_BASE_URL = "http://localhost:5000/api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "customer" | "chef";
  specialty?: string;
  experience?: string;
  location?: string;
  bio?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Registration failed",
    );
  }

  return result;
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Login failed",
    );
  }

  return result;
}

export async function addFood(data: {
  chef_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/foods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to add food",
    );
  }

  return result;
}

export async function getChefFoods(
  chefId: number,
) {
  const response = await fetch(
    `${API_BASE_URL}/foods/chef/${chefId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to load foods",
    );
  }

  return result;
}

export async function updateFood(data: {
  id: number;
  chef_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  is_available: boolean;
}) {
  const response = await fetch(
    `${API_BASE_URL}/foods/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chef_id: data.chef_id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url,
        is_available: data.is_available,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update food",
    );
  }

  return result;
}

export async function deleteFood(
  foodId: number,
  chefId: number,
) {
  const response = await fetch(
    `${API_BASE_URL}/foods/${foodId}?chef_id=${chefId}`,
    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete food",
    );
  }

  return result;
}

export async function getFoods() {
  const response = await fetch(
    `${API_BASE_URL}/foods`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to load foods",
    );
  }

  return result;
}

export async function getChefOrders(
  chefId: number,
) {
  const response = await fetch(
    `${API_BASE_URL}/orders/chef/${chefId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to load chef orders",
    );
  }

  return result;
}

export async function updateOrderStatus(data: {
  orderId: number;
  chefId: number;
  status:
    | "Placed"
    | "Accepted"
    | "Preparing"
    | "Ready"
    | "Completed"
    | "Cancelled";
}) {
  const response = await fetch(
    `${API_BASE_URL}/orders/${data.orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chef_id: data.chefId,
        status: data.status,
      }),
    },
  );

  const text = await response.text();

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    console.error(
      "Server returned non-JSON response:",
      text,
    );

    throw new Error(
      "Backend returned an invalid response.",
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update order status",
    );
  }

  return result;
}

export async function createOrder(data: {
  customer_id: number;
  total_amount: number;
  delivery_address: string;
  items: {
    food_id: number;
    quantity: number;
    price: number;
  }[];
}) {
  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to place order",
    );
  }

  return result;
}

// Submit a customer review
export async function submitReview(data: {
  customer_id: number;
  food_id: number;
  rating: number;
  comment: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to submit review",
    );
  }

  return result;
}