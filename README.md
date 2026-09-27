# RasoiHub: Your Home Kitchen

Build a modern, startup-grade food marketplace web app called "RasoiHub" with the tagline "From Home Kitchens to Your Table".

Brand & Styling:
- Palette: Deep terracotta / burnt orange, warm cream, dark charcoal, muted sage green accent.
- Premium, warm, food-inspired aesthetic with high quality food photography (no emojis for food images), rounded cards, subtle shadows, and clean modern typography.

Key Capabilities & Architecture:
- Built with modular React, TypeScript, Tailwind CSS, Lucide icons, and persistent state in localStorage so added dishes, placed orders, status updates, and reviews persist across refreshes.
- Dual-role support (Customer and Home Chef) with an intuitive role switcher or dedicated navigation pathways for testing and viva presentation.

Customer Flow:
1. Landing Page: Hero section with headline "Homemade Food. Made by People You Can Trust.", search bar, quick category pills, "Why RasoiHub" feature cards, "How It Works" 4-step process, featured dishes, and customer testimonials.
2. Explore Food: Search by dish/chef/cuisine, category filter tabs (All, Breakfast, Lunch, Dinner, Snacks, Desserts), rich cards showing food photo, name, chef name, rating, price (₹), and "Add to Cart" / "View Details".
3. Food Details View: Large image, price, rating, ingredients/description, quantity selector, chef profile card (chef photo, specialty, location, dishes count), and customer reviews.
4. Cart & Checkout: Slide-over or page cart with item totals, quantity controls, and mock checkout capturing customer delivery details (Name, Phone, Delivery Address) resulting in an instant order confirmation.
5. Visual Order Tracking: Step-by-step progress bar tracking real statuses: Order Placed → Order Accepted → Preparing → Ready → Completed.
6. Reviews: 5-star rating selector and feedback submission for completed orders that updates the food item and chef ratings.

Chef Flow:
1. Become a Chef & Login: Registration form capturing Chef Name, Specialty, Experience, Location, Bio, and Profile Photo.
2. Chef Dashboard: Stat cards (Total Food Items, Active Orders, Completed Orders, Average Rating), quick actions, and recent activity.
3. Add Food: Full form including Food Name, Description, Category, Price (₹), Preparation Time, Available Quantity, and custom Food Image upload (FileReader data URL / preview).
4. My Menu: Chef dish management grid with Edit and Delete options.
5. Customer Orders Management: Live list of customer orders with one-click actions to advance status (Placed → Accepted → Preparing → Ready → Completed), which automatically syncs with the customer's order tracker.

General Pages:
- About Us, How It Works, Authentication modals/pages, and a polished responsive footer.
- Clean, beginner-friendly code organization with helpful comments for a BCA college presentation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/85bda2ce-e69e-4f4c-a2ea-3007817ca8f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
