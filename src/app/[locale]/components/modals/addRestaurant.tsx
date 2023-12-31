import styles from "@/styles/image-input.module.sass";
import convertToBase64 from "@/utils/convertToBase64";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import get64BaseSize from "@/utils/getBase64Size";
import { useTranslations } from "next-intl";

interface AddRestaurantModalProps {
  setVisibleModal: Function;
  setRestaurants: Function;
  restaurants: any[];
}

export function AddRestaurantModal({
  setVisibleModal,
  setRestaurants,
  restaurants,
}: AddRestaurantModalProps) {
  const t = useTranslations("Modals.AddRestaurantModal");

  const [restaurantImageToCreate, setRestaurantImageToCreate] = useState<
    string | undefined
  >();

  function handleAddNewRestaurantSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const name = (
        form.elements.namedItem("newRestaurantName") as HTMLInputElement
      ).value;
      const description = (
        form.elements.namedItem(
          "newRestaurantDescription"
        ) as HTMLTextAreaElement
      ).value;

      axios
        .post("/api/restaurants/add", {
          name,
          image: restaurantImageToCreate,
          description,
        })
        .then((newRestaurantResponse) => {
          if (newRestaurantResponse.status !== 200)
            throw new Error(newRestaurantResponse.data.message);

          restaurants.push(newRestaurantResponse.data.restaurant);
          setRestaurants(restaurants);
          toast.success(newRestaurantResponse.data.message);
          setVisibleModal(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Could not add restaurant");
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleFileUpload(e: React.FormEvent<HTMLInputElement>) {
    try {
      const element = e.currentTarget;
      const file = element.files![0] ?? "";
      const maxSizeInBytes = 15 * 1024 * 1024; // 15MB

      if (file.size > maxSizeInBytes)
        throw new Error(
          "Image size exceeds the maximum allowed size (15MB). Please choose a smaller image."
        );

      const imageBase64 = (await convertToBase64(file)) as string;

      setRestaurantImageToCreate(imageBase64);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <>
      <h2>{t("title")}</h2>
      <form onSubmit={handleAddNewRestaurantSubmit}>
        <label>{t("restaurantName")}</label>
        <input
          type="text"
          name="newRestaurantName"
          placeholder="my new restaurant"
          required
        />
        {restaurantImageToCreate ? (
          <div className={styles.imageUpload}>
            <div>
              <Image
                src={restaurantImageToCreate}
                alt="Added Image"
                width="32"
                height="32"
              />
            </div>
            <div>
              <h3>{t("uploadedImage")}</h3>
              <p>{`Size: ${get64BaseSize(restaurantImageToCreate)} KB`}</p>
            </div>
          </div>
        ) : (
          <label className={styles.imageUpload} htmlFor="restaurantImageUpload">
            <div>+</div>
            <div>
              <h3>{t("uploadImage")}</h3>
              <input
                id="restaurantImageUpload"
                type="file"
                name="newRestaurantImage"
                accept=".jpg, .png, .jpeg"
                onChange={handleFileUpload}
                required
              />
              <p>{t("imageFormatMessage")}</p>
            </div>
          </label>
        )}
        <label>{t("restaurantDescription")}</label>
        <textarea name="newRestaurantDescription" required />
        <button type="submit">{t("addRestaurant")}</button>
      </form>
    </>
  );
}
