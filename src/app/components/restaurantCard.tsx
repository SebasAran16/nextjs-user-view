import styles from "@/styles/components/restaurant-card.module.sass";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConfirmationModal } from "./confirmationModal";
import { Object } from "@/types/structs/object.enum";

interface RestaurantCardProps {
  restaurant: any;
  setRestaurants: Function;
  restaurants: any[];
}

export function RestaurantCard({
  restaurant,
  setRestaurants,
  restaurants,
}: RestaurantCardProps) {
  const pathname = usePathname();

  const [visibleConfirmation, setVisibleConfirmation] = useState(false);

  return (
    <section className={styles.restaurantCardContainer}>
      <div>
        <Image
          src="/logo.png"
          alt="Restaurant Image"
          width="100"
          height="100"
        />
        <p className={styles.views}>
          <span>Views:</span> 6
        </p>
      </div>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.description}</p>

      <div>
        <Link href={pathname + "/" + restaurant._id}>
          <button>Manage</button>
        </Link>
        <button onClick={() => setVisibleConfirmation(true)}>Eliminate</button>
      </div>
      <ConfirmationModal
        object={restaurant}
        objectType={Object.RESTAURANT}
        visibleConfirmation={visibleConfirmation}
        setVisibleConfirmation={setVisibleConfirmation}
        setObjects={setRestaurants}
        pastObjects={restaurants}
      />
    </section>
  );
}
