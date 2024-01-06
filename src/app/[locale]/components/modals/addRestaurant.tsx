import styles from "@/styles/image-input.module.sass";
import convertToBase64 from "@/utils/convertToBase64";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import get64BaseSize from "@/utils/getBase64Size";
import { useTranslations } from "next-intl";
import { createAmzObject } from "@/utils/amzS3/createAmzObject";
import { Object } from "@/types/structs/object.enum";
import { imageSourceFromBase64 } from "@/utils/imageSourceFromBase64";
import { kbSizeFromFileSize } from "@/utils/kbSizeFromFileSize";

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
    File | undefined
  >();
  const [previewImage, setPreviewImage] = useState<undefined | string>();

  async function handleAddNewRestaurantSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
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

      const newRestaurantResponse = await axios.post("/api/restaurants/add", {
        name,
        description,
      });

      if (newRestaurantResponse.status !== 200)
        throw new Error(newRestaurantResponse.data.message);

      let newRestaurant = newRestaurantResponse.data.restaurant;

      const mediaFormData = new FormData();
      mediaFormData.append("objectId", newRestaurant._id);
      mediaFormData.append("mediaFile", restaurantImageToCreate!);
      mediaFormData.append("objectType", Object.RESTAURANT);
      const objectS3Response = await createAmzObject(mediaFormData);
      if (!objectS3Response.success) {
        toast.error(objectS3Response.errorMessage);
      } else {
        newRestaurant = objectS3Response.object;
      }

      restaurants.push(newRestaurant);
      setRestaurants(restaurants);
      toast.success(newRestaurantResponse.data.message);
      setVisibleModal(false);
    } catch (err) {
      console.log(err);
      toast.error("Could not add restaurant");
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

      const imageBuffer = Buffer.from(await file.arrayBuffer());
      setPreviewImage(imageBuffer.toString("base64"));
      setRestaurantImageToCreate(file);
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
        {restaurantImageToCreate && previewImage ? (
          <div className={styles.imageUpload}>
            <div>
              <Image
                src={imageSourceFromBase64(previewImage)}
                alt="Added Image"
                width="32"
                height="32"
              />
            </div>
            <div>
              <h3>{t("uploadedImage")}</h3>
              <p>{`Size: ${kbSizeFromFileSize(
                restaurantImageToCreate.size
              )} KB`}</p>
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
