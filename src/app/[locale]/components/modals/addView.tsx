import styles from "@/styles/components/modals/view.module.sass";
import Image from "next/image";
import convertToBase64 from "@/utils/convertToBase64";
import get64BaseSize from "@/utils/getBase64Size";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { imageSourceFromBase64 } from "@/utils/imageSourceFromBase64";
import { kbSizeFromFileSize } from "@/utils/kbSizeFromFileSize";
import { Object } from "@/types/structs/object.enum";
import { createAmzObject } from "@/utils/amzS3/createAmzObject";

interface AddViewProps {
  setVisibleModal: Function;
  setViews: Function;
  views: any[];
  restaurantId: string;
  setEditingView: Function;
}

export function AddViewModal({
  setViews,
  setVisibleModal,
  restaurantId,
  setEditingView,
  views,
}: AddViewProps) {
  const t = useTranslations("Modals.AddViewModal");
  const [viewImageToCreate, setViewImageToCreate] = useState<
    File | undefined
  >();
  const [previewImage, setPreviewImage] = useState<undefined | string>();
  const [viewUrl, setViewUrl] = useState<undefined | string>();

  const handleCreateView = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const urlRegex = /^(?!-)[a-z0-9]+(?:-[a-z0-9]+)*$(?<!-)/;

      const newViewName = (
        form.elements.namedItem("newViewName") as HTMLInputElement
      ).value;
      const newViewUrl = (
        form.elements.namedItem("newViewUrl") as HTMLInputElement
      ).value;

      if (!viewImageToCreate) {
        toast.error("Please, upload view image to continue");
        return;
      } else if (!urlRegex.test(newViewUrl)) {
        toast.error("URL set has invalid syntax");
        return;
      }

      const createViewResponse = await axios.post("/api/views/add", {
        restaurant_id: restaurantId,
        name: newViewName,
        url: newViewUrl,
      });

      if (createViewResponse.status !== 200)
        throw new Error(createViewResponse.data.message);

      let newView = createViewResponse.data.view;

      const mediaFormData = new FormData();
      mediaFormData.append("objectId", newView._id);
      mediaFormData.append("mediaFile", viewImageToCreate!);
      mediaFormData.append("objectType", Object.VIEW);
      mediaFormData.append("restaurantId", restaurantId);
      mediaFormData.append("viewUrl", newView.url);
      const objectS3Response = await createAmzObject(mediaFormData);
      if (!objectS3Response.success) {
        toast.error(objectS3Response.errorMessage);
      } else {
        newView = objectS3Response.object;
      }

      setEditingView(newView);
      setVisibleModal(false);
      setViews([...views, newView]);
      toast.success(createViewResponse.data.message);
    } catch (err: any) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else {
        toast.error(err.message);
      }
    }
  };

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
      setViewImageToCreate(file);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <>
      <h2>{t("title")}</h2>
      <form onSubmit={handleCreateView}>
        <label>{t("viewName")}</label>
        <input
          placeholder="McDonalds View"
          type="text"
          name="newViewName"
          required
        />
        <label>{t("viewUrl")}</label>
        <input
          placeholder="mc-donalds"
          type="text"
          name="newViewUrl"
          minLength={3}
          onChange={(e) => {
            const value = e.currentTarget.value;

            if (value.length > 2) setViewUrl(value);
            if (value.length < 3) setViewUrl(undefined);
          }}
          required
        />
        {viewUrl ? (
          <p>
            {t("urlShowerMessage") + "https://customerview.app/view/" + viewUrl}
          </p>
        ) : (
          ""
        )}
        {viewImageToCreate && previewImage ? (
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
              <p>{`Size: ${kbSizeFromFileSize(viewImageToCreate.size)} KB`}</p>
            </div>
          </div>
        ) : (
          <label className={styles.imageUpload} htmlFor="viewImageUpload">
            <div>+</div>
            <div>
              <h3>{t("uploadImage")}</h3>
              <input
                id="viewImageUpload"
                type="file"
                name="projectImage"
                accept=".jpg, .png, .jpeg"
                onChange={handleFileUpload}
                required
              />
              <p>{t("imageFormatMessage")}</p>
            </div>
          </label>
        )}

        <button type="submit">{t("addView")}</button>
      </form>
    </>
  );
}
