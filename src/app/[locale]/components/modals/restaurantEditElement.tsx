import styles from "@/styles/components/modals/element.module.sass";
import IEditElement from "@/types/editElement.interface";
import axios from "axios";
import toast from "react-hot-toast";
import CurrentElementData from "../currentElementData";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ElementTypes from "@/utils/elementsStruct";
import { LinkGroupImageType } from "@/types/structs/linkGroupImageType";
import { useTranslations } from "next-intl";
import { urlRegex } from "@/utils/inputsRegex";
import { getS3ObjectKeyFromObject } from "@/utils/amzS3/getS3ObjectKeyFromObject";
import { editAmzObject } from "@/utils/amzS3/editAmzObject";
import { Object } from "@/types/structs/object.enum";
import BlobReduce from "image-blob-reduce";

interface RestaurantEditElementModalProps {
  setVisibleModal: Function;
  element: any;
  currentElements: any[];
  setCurrentElements: Function;
}

export function RestaurantEditElementModal({
  setVisibleModal,
  element,
  setCurrentElements,
  currentElements,
}: RestaurantEditElementModalProps) {
  const t = useTranslations("Modals.RestaurantEditElementModal");
  const router = useRouter();
  const [disableEditButton, setDisableEditButton] = useState(true);
  const [editElementAsset, setEditElementAsset] = useState<undefined | File>();

  const handleEditElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    const form = e.currentTarget;
    try {
      e.preventDefault();

      const editElementObject: IEditElement = {
        id: element._id,
      };

      const elementType = element.type;

      const elementText = (
        form.elements.namedItem("editElementText") as HTMLInputElement
      ).value;
      if (elementText !== "") editElementObject.text = elementText;

      switch (elementType) {
        case ElementTypes.TEXT:
          break;
        case ElementTypes.VIDEO:
        case ElementTypes.IMAGE:
          const mediaFormData = new FormData();

          mediaFormData.append("mediaFile", editElementAsset!);
          mediaFormData.append(
            "objectKey",
            getS3ObjectKeyFromObject(element, Object.ELEMENT)
          );

          const editS3ObjectResponse = await editAmzObject(mediaFormData);

          if (!editS3ObjectResponse.success) {
            toast.error(editS3ObjectResponse.errorMessage);
            return;
          }

          const newCDNUrl = editS3ObjectResponse.objectCDNUrl;

          if (elementType === ElementTypes.IMAGE) {
            editElementObject.image_link = newCDNUrl;
          } else if (elementType === ElementTypes.VIDEO) {
            editElementObject.video_link = newCDNUrl;
          }

          break;
        case ElementTypes.LINK_GROUP:
          const linkGroup = element.link_group;
          for (let i = 0; i < element.link_group.length; i++) {
            const customerIndex = i + 1;
            const linkToEdit =
              (
                form.elements.namedItem(
                  "editElementLinkGroup" + customerIndex
                ) as HTMLInputElement
              ).value ?? "";
            const linkImageToEdit =
              (
                form.elements.namedItem(
                  "editLinkGroupImageType" + customerIndex
                ) as HTMLInputElement
              ).value ?? "";

            if (linkToEdit) {
              if (!urlRegex.test(linkToEdit)) {
                toast.error("URL Syntax invalid for Link " + customerIndex);
                form.reset();
                return;
              }

              if (linkGroup[i]) {
                linkGroup[i].link = linkToEdit;
              }
            }
            if (linkImageToEdit) {
              linkGroup[i].image = linkImageToEdit;
            }
          }

          editElementObject.link_group = linkGroup;
          break;
        default:
          throw new Error("Element type not valid");
      }

      const editResponse = await axios.post(
        "/api/elements/edit",
        editElementObject
      );

      if (editResponse.status !== 200)
        throw new Error(editResponse.data.message);

      const indexToSwap = currentElements.indexOf(element);
      currentElements[indexToSwap] = editResponse.data.element;
      setCurrentElements(currentElements);
      router.refresh();
      setDisableEditButton(true);
      toast.success(editResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue editing the element");
    } finally {
      form.reset();
      setVisibleModal(false);
    }
  };

  async function handleFileUpload(e: React.FormEvent<HTMLInputElement>) {
    try {
      const element = e.currentTarget;
      const file = element.files![0] ?? "";
      const maxSizeInBytes = 15 * 1024 * 1024; // 15MB
      const maxWidth = 1200;

      const fileType = file.type;

      if (fileType.startsWith("image")) {
        const reducer = new BlobReduce();
        const resizedFileBlob = await reducer.toBlob(file, { max: maxWidth });

        if (resizedFileBlob.size > maxSizeInBytes) {
          toast.error("Resized image exceeds the maximum allowed size (15MB).");
          return;
        }

        const resizedFile = new File([resizedFileBlob], file.name, {
          type: resizedFileBlob.type,
          lastModified: Date.now(),
        });

        setEditElementAsset(resizedFile);
      } else if (fileType.startsWith("video")) {
        setEditElementAsset(file);
      } else {
        toast.error(
          "File type not supported. File Type Sent: " +
            fileType +
            " , supported only image or videos"
        );
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <div className={styles.modalActionContainer}>
      <CurrentElementData element={element} />
      <h2>{t("title")}</h2>
      <form onSubmit={handleEditElementSubmit}>
        <label>{t("newText")}</label>
        <input
          type="text"
          name="editElementText"
          placeholder="New Text"
          onChange={() => setDisableEditButton(false)}
        />
        {element ? (
          element.type === ElementTypes.TEXT ? (
            ""
          ) : element.type === ElementTypes.VIDEO ? (
            <>
              <label>{t("newVideo")}</label>
              <label
                className={styles.imageUpload}
                htmlFor="elementVideoUpload"
              >
                <div>
                  <input
                    id="elementVideoUpload"
                    type="file"
                    name="newElementVideo"
                    accept="video/*"
                    onChange={(e) => {
                      handleFileUpload(e);
                      setDisableEditButton(false);
                    }}
                    required
                  />
                  <p>Only Accept Video</p>
                </div>
              </label>
            </>
          ) : element.type === ElementTypes.IMAGE ? (
            <>
              <label>{t("newImage")}</label>
              <label
                className={styles.imageUpload}
                htmlFor="elementImageUpload"
              >
                <div>
                  <input
                    id="elementImageUpload"
                    type="file"
                    name="newElementImage"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileUpload(e);
                      setDisableEditButton(false);
                    }}
                    required
                  />
                  <p>Only Accept Images</p>
                </div>
              </label>
            </>
          ) : element.type === ElementTypes.LINK ? (
            <>
              <label>{t("newButtonLink")}</label>
              <input
                type="text"
                name="editElementButtonLink"
                placeholder="https://restaurant.com/menu"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : element.type === ElementTypes.LINK_GROUP ? (
            <>
              {element.link_group.map((group: any, index: number) => {
                const clientIndex = index + 1;

                return (
                  <div key={index}>
                    <label>{`${t("linksGroup.newLink")}${clientIndex}:`}</label>
                    <input
                      type="text"
                      name={`editElementLinkGroup${clientIndex}`}
                      placeholder="https://restaurant.com/menu"
                      onChange={() => setDisableEditButton(false)}
                    />
                    <select
                      name={"editLinkGroupImageType" + clientIndex}
                      onChange={() => setDisableEditButton(false)}
                    >
                      <option value="">{`${t(
                        "linksGroup.newImage-1"
                      )}${clientIndex}${t("linksGroup.newImage-2")}`}</option>
                      <option value={LinkGroupImageType.FACEBOOK}>
                        Facebook
                      </option>
                      <option value={LinkGroupImageType.INSTAGRAM}>
                        Instagram
                      </option>
                      <option value={LinkGroupImageType.LINKEDIN}>
                        Linkedin
                      </option>
                      <option value={LinkGroupImageType.TIK_TOK}>
                        Tik Tok
                      </option>
                      <option value={LinkGroupImageType.X}>X</option>
                      <option value={LinkGroupImageType.YOUTUBE}>
                        YouTube
                      </option>
                      <option value={LinkGroupImageType.WEBSITE}>
                        Website
                      </option>
                      <option value={LinkGroupImageType.HASHTAG}>
                        Hashtag
                      </option>
                    </select>
                  </div>
                );
              })}
            </>
          ) : (
            t("wrongElementType")
          )
        ) : (
          ""
        )}
        <button type="submit" disabled={disableEditButton}>
          {t("editElement")}
        </button>
        {disableEditButton ? (
          <p className={styles.discreteText}>{t("disabledButtonText")}</p>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
