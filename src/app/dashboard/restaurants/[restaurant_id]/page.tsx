"use client";
import ViewsBox from "@/app/components/viewsBox";
import { useEffect } from "react";

interface RestaurantManagerProps {
  params: { restaurant_id: string };
}

export default function RestaurantManager({ params }: RestaurantManagerProps) {
  useEffect(() => {});

  return (
    <section>
      <h2>Restaurant Manager:</h2>
      <ViewsBox restaurantId={params.restaurant_id} />
    </section>
  );
}
