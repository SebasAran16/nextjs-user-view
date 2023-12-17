import styles from "@/styles/components/restaurant-card.module.sass";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface RestaurantCardProps {
  restaurant: any;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const pathname = usePathname();

  return (
    <section className={styles.restaurantCardContainer}>
      <div>
        <Image
          src="/logo.png"
          alt="Restaurant Image"
          width="100"
          height="100"
        />
      </div>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.description}</p>
      <div>
        <p>
          <span>Views:</span> 6
        </p>
      </div>
      <div>
        <Link href={pathname + "/" + restaurant._id}>
          <button>Manage</button>
        </Link>
        <button>Eliminate</button>
      </div>
    </section>
  );
}
