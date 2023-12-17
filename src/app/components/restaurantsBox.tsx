"use client";
import restaurantCardStyles from "@/styles/components/restaurant-card.module.sass";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { RestaurantCard } from "./restaurantCard";
import { Modal } from "./modal";
import { ModalPurpose } from "@/utils/structs/modalPurposes.enum";

export function RestaurantsBox() {
  const [restaurants, setRestaurants] = useState<undefined | any>();
  const [updateRestaurants, setUpdateRestaurants] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    if (updateRestaurants) {
      axios
        .get("/api/restaurants/search")
        .then((restaurantsResponse) => {
          if (restaurantsResponse.status !== 200)
            throw new Error(restaurantsResponse.data.message);

          const restaurants = restaurantsResponse.data.restaurants;
          setRestaurants(restaurants);
        })
        .catch((err: any) => {
          console.log(err);
          toast.error("Could not get restaurants");
        })
        .finally(() => setUpdateRestaurants(false));
    }
  }, [restaurants, updateRestaurants]);

  return (
    <section>
      <h2>Resturants:</h2>
      <p>
        {restaurants
          ? restaurants.length > 0
            ? "This is a list of your restaurants"
            : "You have no restaurants"
          : ""}
      </p>
      {restaurants ? (
        <>
          {restaurants.map((restaurant: any, index: number) => {
            return <RestaurantCard key={index} restaurant={restaurant} />;
          })}
          <div
            className={restaurantCardStyles.restaurantCardContainer}
            onClick={() => setVisibleModal(true)}
          >
            <h3>+ Add Restaurant</h3>
          </div>
          <Modal
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            modalPurpose={ModalPurpose.ADD_RESTAURANT}
            setUpdateRestaurants={setUpdateRestaurants}
          />
        </>
      ) : (
        "Loading..."
      )}
    </section>
  );
}
