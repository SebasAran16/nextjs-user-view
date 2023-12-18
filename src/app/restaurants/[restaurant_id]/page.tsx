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
      <p>{params.restaurant_id}</p>
      <ViewsBox />
    </section>
  );
}
