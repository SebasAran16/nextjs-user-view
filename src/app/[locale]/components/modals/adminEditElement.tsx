import styles from "@/styles/components/modals/element.module.sass";
import IEditElement from "@/types/editElement.interface";
import axios from "axios";
import toast from "react-hot-toast";
import CurrentElementData from "../currentElementData";
import { useState } from "react";
import ElementTypes from "@/utils/elementsStruct";
import { LinkGroupImageType } from "@/types/structs/linkGroupImageType";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { urlRegex } from "@/utils/inputsRegex";
import { Object } from "@/types/structs/object.enum";
import { editAmzObject } from "@/utils/amzS3/editAmzObject";
import { getS3ObjectKeyFromObject } from "@/utils/amzS3/getS3ObjectKeyFromObject";

interface AdminEditElementModalProps {
  setVisibleModal: Function;
  currentEditElement: any;
  setCurrentElements: Function;
  currentElements: any[];
}

export function AdminEditElementModal({
  setVisibleModal,
  currentEditElement,
  setCurrentElements,
  currentElements,
}: AdminEditElementModalProps) {
  const t = useTranslations("Modals.AdminEditElementModal");
  const router = useRouter();

  const [disableEditButton, setDisableEditButton] = useState(true);
  const [initialElementGroupLinks] = useState(
    currentEditElement.link_group ? currentEditElement.link_group.length : 0
  );
  const [additionalGroupLinks, setAdditionalGroupLinks] = useState<
    Array<number>
  >([]);
  const [editElementAsset, setEditElementAsset] = useState<undefined | File>();

  const handleEditElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    const form = e.currentTarget;

    try {
      e.preventDefault();

      const editElementObject: IEditElement = {
        id: currentEditElement._id,
      };

      const elementType = currentEditElement.type;

      const elementName = (
        form.elements.namedItem("editElementName") as HTMLInputElement
      ).value;
      if (elementName !== "") editElementObject.name = elementName;

      const elementText = (
        form.elements.namedItem("editElementText") as HTMLInputElement
      ).value;
      if (elementText !== "") editElementObject.text = elementText;

      const mediaFormData = new FormData();

      switch (elementType) {
        case ElementTypes.TEXT:
          break;
        case ElementTypes.VIDEO:
        case ElementTypes.IMAGE:
          mediaFormData.append("mediaFile", editElementAsset!);
          mediaFormData.append(
            "objectKey",
            getS3ObjectKeyFromObject(currentEditElement, Object.ELEMENT)
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
        case ElementTypes.LINK:
          const elementButtonLink = (
            form.elements.namedItem("editElementButtonLink") as HTMLInputElement
          ).value;
          if (elementButtonLink !== "") {
            if (!urlRegex.test(elementButtonLink)) {
              toast.error("URL Syntax invalid for Button Link");
              form.reset();
              return;
            }

            editElementObject.button_link = elementButtonLink;
          }

          break;
        case 5:
          const linkGroup = currentEditElement.link_group;
          for (
            let i = 0;
            i < initialElementGroupLinks + additionalGroupLinks.length;
            i++
          ) {
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
              } else {
                linkGroup.push({ link: linkToEdit, image: "" });
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

      const indexToSwap = currentElements.indexOf(currentEditElement);
      currentElements[indexToSwap] = editResponse.data.element;
      setCurrentElements(currentElements);
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

      if (file.size > maxSizeInBytes) {
        toast.error(
          "Media size exceeds the maximum allowed size (15MB). Please choose a smaller one."
        );
        return;
      }
      const fileType = file.type;

      if (fileType.startsWith("image") || fileType.startsWith("video")) {
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
      <CurrentElementData element={currentEditElement} />
      <h2>{t("title")}</h2>
      <form onSubmit={handleEditElementSubmit}>
        <label>{t("newName")}</label>
        <input
          type="text"
          name="editElementName"
          placeholder="Modified name"
          onChange={() => setDisableEditButton(false)}
        />
        <label>{t("newText")}</label>
        <input
          type="text"
          name="editElementText"
          placeholder="New Text"
          onChange={() => setDisableEditButton(false)}
        />
        {currentEditElement ? (
          currentEditElement.type === ElementTypes.TEXT ? (
            ""
          ) : currentEditElement.type === ElementTypes.VIDEO ? (
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
          ) : currentEditElement.type === ElementTypes.IMAGE ? (
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
          ) : currentEditElement.type === ElementTypes.LINK ? (
            <>
              <label>{t("newButtonLink")}</label>
              <input
                type="text"
                name="editElementButtonLink"
                placeholder="https://restaurant.com/menu"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : currentEditElement.type === ElementTypes.LINK_GROUP ? (
            <>
              {currentEditElement.link_group.map(
                (group: any, index: number) => {
                  const clientIndex = index + 1;

                  return (
                    <div key={index}>
                      <label>{`${t(
                        "linksGroup.newLink"
                      )}${clientIndex}:`}</label>
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
                }
              )}
              {additionalGroupLinks.map((linkIndex, index) => {
                return (
                  <div key={index}>
                    <div className={styles.spaceBetweenContainer}>
                      <label>{`${t(
                        "linksGroup.newLink"
                      )}${linkIndex}:*`}</label>
                    </div>

                    <input
                      type="text"
                      name={`editElementLinkGroup${linkIndex}`}
                      placeholder="https://restaurant.com/menu"
                      onChange={() => setDisableEditButton(false)}
                      required
                    />
                    <select
                      name={"editLinkGroupImageType" + linkIndex}
                      onChange={() => setDisableEditButton(false)}
                      required
                    >
                      <option value="">{`${t(
                        "linksGroup.newImage-1"
                      )}${linkIndex}${t("linksGroup.newImage-2")}`}</option>
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
              <button
                type="button"
                onClick={() => {
                  const pastGroupLinkAdded =
                    initialElementGroupLinks + additionalGroupLinks.length;

                  if (pastGroupLinkAdded > 4) {
                    toast.error("Only 5 links can be added");
                    return;
                  }

                  additionalGroupLinks.push(
                    additionalGroupLinks.length > 0
                      ? initialElementGroupLinks +
                          additionalGroupLinks.length +
                          1
                      : initialElementGroupLinks + 1
                  );
                  setAdditionalGroupLinks(additionalGroupLinks);
                  router.refresh();
                }}
                disabled={
                  initialElementGroupLinks + additionalGroupLinks.length > 4
                }
              >
                {`+${t("linksGroup.addLink")}`}
              </button>
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
