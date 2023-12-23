"use client";
import styles from "@/styles/components/restaurants-box.module.sass";
import restaurantCardStyles from "@/styles/components/restaurant-card.module.sass";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { RestaurantCard } from "./restaurantCard";
import { Modal } from "./modal";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";
import { UserRol } from "@/types/structs/userRol.enum";
import { useGlobalState } from "@/utils/globalStates";

export function RestaurantsBox() {
  const [userData] = useGlobalState("userData");

  const [restaurants, setRestaurants] = useState<undefined | any>();
  const [visibleModal, setVisibleModal] = useState(false);
  const [userRol, setUserRol] = useState<undefined | string>();

  useEffect(() => {
    if (!restaurants) {
      axios
        .get("/api/restaurants/search")
        .then((restaurantsResponse) => {
          if (restaurantsResponse.status !== 200)
            throw new Error(restaurantsResponse.data.message);

          const restaurants = restaurantsResponse.data.restaurants;
          const rol = restaurantsResponse.data.rol;

          setRestaurants(restaurants);
          setUserRol(rol);
        })
        .catch((err: any) => {
          console.log(err);
          toast.error("Could not get restaurants");
        });
    }
  }, [restaurants]);

  return (
    <section id={styles.restaurantsContainer}>
      <h2>Resturants:</h2>
      <p>
        {restaurants
          ? restaurants.length > 0
            ? userRol !== UserRol.ADMIN
              ? "This is a list of your restaurants"
              : "This is a list of all restaurants"
            : "You have no restaurants"
          : ""}
      </p>
      <div>
        {restaurants ? (
          <>
            {restaurants.map((restaurant: any, index: number) => {
              return (
                <RestaurantCard
                  key={index}
                  restaurant={restaurant}
                  restaurants={restaurants}
                  setRestaurants={setRestaurants}
                />
              );
            })}
          </>
        ) : (
          "Loading..."
        )}
      </div>
      {userData ? (
        userData.rol !== "admin" ? (
          <div
            className={restaurantCardStyles.restaurantCardContainer}
            onClick={() => setVisibleModal(true)}
          >
            <h3>+ Add Restaurant</h3>
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <Modal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        modalPurpose={ModalPurpose.ADD_RESTAURANT}
        setObjects={setRestaurants}
        pastObjects={restaurants}
      />
    </section>
  );
}
