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
import { useTranslations } from "next-intl";
import Image from "next/image";

export function RestaurantsBox() {
  const t = useTranslations("Dashboard.Components.Restaurants");

  const [userData] = useGlobalState("userData");

  const [restaurants, setRestaurants] = useState<undefined | any>();
  const [visibleModal, setVisibleModal] = useState(false);
  const [userRol, setUserRol] = useState<undefined | string>();
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(
    "0." + (itemsPerPage - 1).toString()
  );
  const [restaurantViews, setRestaurantViews] = useState<undefined | any>();

  console.log(restaurantViews);
  useEffect(() => {
    if (!restaurants) {
      axios
        .get("/api/restaurants/search")
        .then((restaurantsResponse) => {
          if (restaurantsResponse.status !== 200)
            throw new Error(restaurantsResponse.data.message);

          const fetchedRestaurants = restaurantsResponse.data.restaurants;
          const fetchedRol = restaurantsResponse.data.rol;
          const requests = fetchedRestaurants.map((restaurant: any) => {
            return axios.post("/api/views/find-for-restaurant", {
              restaurantId: restaurant._id,
            });
          });

          Promise.all(requests)
            .then((viewsResponses) => {
              const views: any = {};
              viewsResponses.forEach((viewsResponse, index) => {
                const restaurantId = fetchedRestaurants[index]._id;
                if (viewsResponse.status !== 200)
                  throw new Error(viewsResponse.data.message);

                views[restaurantId] = viewsResponse.data.views;
              });

              setRestaurantViews(views);
              setRestaurants(fetchedRestaurants);
              setUserRol(fetchedRol);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          toast.error("Could not get restaurants");
        });
    }
  }, [restaurants]);

  function parsePages(currentPage: string): number[] {
    const [starting, last] = currentPage.split(".");

    return [Number(starting), Number(last)];
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    try {
      const buttonValueIndex = Number(e.currentTarget.innerText);
      const newStartingIndex = (buttonValueIndex - 1) * itemsPerPage;
      const newLastIndex = newStartingIndex + itemsPerPage - 1;

      setCurrentPage(
        `${newStartingIndex.toString()}.${newLastIndex.toString()}`
      );
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <section id={styles.restaurantsContainer}>
      <h2>{t("title")}:</h2>
      <p>
        {restaurants
          ? restaurants.length > 0
            ? userRol !== UserRol.ADMIN
              ? t("restaurantRestaurantsText")
              : t("adminRestaurantsText")
            : t("noRestaurantsText")
          : ""}
      </p>
      <div>
        {restaurants && restaurantViews ? (
          <>
            {restaurants.map((restaurant: any, index: number) => {
              const [starting, last] = parsePages(currentPage);

              if (index >= starting && index <= last) {
                console.log(restaurantViews[restaurant._id]);
                return (
                  <RestaurantCard
                    key={index}
                    restaurant={restaurant}
                    restaurants={restaurants}
                    setRestaurants={setRestaurants}
                    views={restaurantViews[restaurant._id]}
                  />
                );
              }
            })}
          </>
        ) : (
          <Image src="/icons/loader.gif" alt="Lader" height="50" width="50" />
        )}
      </div>
      <div className={styles.paginationButtonsContainer}>
        {restaurants
          ? restaurants.map((restaurant: any, index: number) => {
              if (index % itemsPerPage === 0) {
                const paginationIndex = index / itemsPerPage;
                const [currentPageStart] = parsePages(currentPage);
                const prevPage = currentPageStart + itemsPerPage;
                const nextPage = currentPageStart - itemsPerPage;

                if (
                  paginationIndex === currentPageStart / itemsPerPage ||
                  paginationIndex === prevPage / itemsPerPage ||
                  paginationIndex === nextPage / itemsPerPage
                ) {
                  return (
                    <button
                      key={index}
                      className={
                        paginationIndex === currentPageStart / itemsPerPage
                          ? styles.currentPagination
                          : ""
                      }
                      onClick={handleButtonClick}
                    >
                      {index / itemsPerPage + 1}
                    </button>
                  );
                }
              }
            })
          : ""}
      </div>
      {userData ? (
        userData.rol !== "admin" ? (
          <div
            className={restaurantCardStyles.restaurantCardContainer}
            onClick={() => setVisibleModal(true)}
          >
            <h3>+ {t("addRestaurant")}</h3>
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
