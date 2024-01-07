import styles from "@/styles/components/modals/element.module.sass";
import imageInputStyles from "@/styles/image-input.module.sass";
import INewElement from "@/types/newElement.interface";
import convertToBase64 from "@/utils/convertToBase64";
import ElementTypes from "@/utils/elementsStruct";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import get64BaseSize from "@/utils/getBase64Size";
import { useRouter } from "next/navigation";
import { LinkGroupImageType } from "@/types/structs/linkGroupImageType";
import { useTranslations } from "next-intl";
import { urlRegex } from "@/utils/inputsRegex";
import { Object } from "@/types/structs/object.enum";
import { createAmzObject } from "@/utils/amzS3/createAmzObject";

interface AddElementModalProps {
  setVisibleModal: Function;
  setCurrentElements: Function;
  currentElements: any[];
  setAddFormType: Function;
  addFormType: number;
  view: any;
}

export function AddElementModal({
  setVisibleModal,
  view,
  setCurrentElements,
  currentElements,
  setAddFormType,
  addFormType,
}: AddElementModalProps) {
  const t = useTranslations("Modals.AddElementModal");
  const router = useRouter();
  const [linkGroupCount, setLinkGroupCount] = useState(0);
  const [newElementAsset, setNewElementAsset] = useState<undefined | File>();

  const handleAddElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    const form = e.currentTarget;

    try {
      e.preventDefault();

      const elementName = (
        form.elements.namedItem("addElementName") as HTMLInputElement
      ).value;
      const elementType = parseInt(
        (form.elements.namedItem("addElementType") as HTMLSelectElement).value
      );

      const addElementObject: INewElement = {
        view_id: view._id,
        name: elementName,
        type: elementType,
      };

      if (elementType !== ElementTypes.LINK_GROUP) {
        const elementText = (
          form.elements.namedItem("addElementText") as HTMLInputElement
        ).value;
        addElementObject.text = elementText;
      }

      const mediaFormData = new FormData();

      switch (elementType) {
        case ElementTypes.TEXT:
          break;
        case ElementTypes.VIDEO:
        case ElementTypes.IMAGE:
          if (newElementAsset) {
            mediaFormData.append("mediaFile", newElementAsset);
            mediaFormData.append("restaurantId", view.owner_id);
            mediaFormData.append("viewUrl", view.url);
          } else {
            const asset =
              elementType === ElementTypes.VIDEO ? " video" : "n image";
            toast.error("Please select a" + asset + " before");
            return;
          }
          break;
        case ElementTypes.LINK:
          const elementButtonLink = (
            form.elements.namedItem("addElementButtonLink") as HTMLInputElement
          ).value;

          if (!urlRegex.test(elementButtonLink)) {
            toast.error("URL Syntax invalid for Button Link");
            form.reset();
            return;
          }

          addElementObject.button_link = elementButtonLink;
          break;
        case ElementTypes.LINK_GROUP:
          const linkGroupValues = [];

          for (let i = 1; i < linkGroupCount + 1; i++) {
            const linkGroupLink = (
              form.elements.namedItem(
                "addElementGroupLink" + i
              ) as HTMLInputElement
            ).value;
            const linkGroupLinkImageType = (
              form.elements.namedItem(
                "linkGroupImageType" + i
              ) as HTMLInputElement
            ).value;

            if (!linkGroupLinkImageType) {
              toast.error("Set image type for link " + i);
              form.reset();
              return;
            } else if (!urlRegex.test(linkGroupLink)) {
              toast.error("URL Syntax invalid for Link " + i);
              form.reset();
              return;
            }

            linkGroupValues.push({
              link: linkGroupLink,
              image: linkGroupLinkImageType,
            });
          }
          addElementObject.link_group = linkGroupValues;
          break;
        default:
          throw new Error("Element type not valid");
      }

      const addResponse = await axios.post(
        "/api/elements/add",
        addElementObject
      );

      if (addResponse.status !== 200) throw new Error(addResponse.data.message);

      let elementCreated = addResponse.data.element;

      if (
        elementType === ElementTypes.IMAGE ||
        elementType === ElementTypes.VIDEO
      ) {
        mediaFormData.append("objectId", elementCreated._id);
        mediaFormData.append("objectType", Object.ELEMENT);
        const objectS3Response = await createAmzObject(mediaFormData);
        if (!objectS3Response.success) {
          toast.error(objectS3Response.errorMessage);
        } else {
          elementCreated = objectS3Response.object;
        }
      }

      currentElements.push(elementCreated);
      setCurrentElements(currentElements);
      setVisibleModal(false);
      toast.success(addResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue adding the element");
    } finally {
      form.reset();
      setAddFormType(undefined);
    }
  };

  const decreaseLinkGroup = () => {
    setLinkGroupCount(linkGroupCount - 1);
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
        setNewElementAsset(file);
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
    <>
      <h2>{t("title")}</h2>
      <form onSubmit={handleAddElementSubmit}>
        <label>{t("elementName")}</label>
        <input
          placeholder="ex Restaurant Menu"
          type="text"
          name="addElementName"
          required
        />
        <label>{t("elementType")}</label>
        <select
          onChange={(e) => {
            const selectedValue = e.target.value;

            if (selectedValue !== "") {
              const addType = parseInt(selectedValue);
              setAddFormType(addType);
              if (addType == ElementTypes.LINK_GROUP) setLinkGroupCount(1);
            }
          }}
          value={addFormType}
          name="addElementType"
          required
        >
          <option value="">{t("elementTypeOptions.fallback")}</option>
          <option value={ElementTypes.TEXT}>
            {t("elementTypeOptions.text.option")}
          </option>
          <option value={ElementTypes.VIDEO}>
            {t("elementTypeOptions.video.option")}
          </option>
          <option value={ElementTypes.IMAGE}>
            {t("elementTypeOptions.image.option")}
          </option>
          <option value={ElementTypes.LINK}>
            {t("elementTypeOptions.link_button.option")}
          </option>
          <option value={ElementTypes.LINK_GROUP}>
            {t("elementTypeOptions.link_group.option")}
          </option>
        </select>
        {addFormType ? (
          addFormType !== ElementTypes.LINK_GROUP ? (
            <>
              <label>{t("elementTypeOptions.text.label")}</label>
              <input
                placeholder="New Offer!"
                type="text"
                name="addElementText"
                required
              />
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {addFormType ? (
          addFormType === ElementTypes.TEXT ? (
            ""
          ) : addFormType === ElementTypes.VIDEO ? (
            <>
              <label>{t("elementTypeOptions.video.label")}</label>
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
                    onChange={handleFileUpload}
                    required
                  />
                  <p>Only Accept Video</p>
                </div>
              </label>
            </>
          ) : addFormType === ElementTypes.IMAGE ? (
            <>
              <label>{t("elementTypeOptions.image.label")}</label>
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
                    onChange={handleFileUpload}
                    required
                  />
                  <p>Only Accept Images</p>
                </div>
              </label>
            </>
          ) : addFormType === ElementTypes.LINK ? (
            <>
              <label>{t("elementTypeOptions.link_button.label")}</label>
              <input
                placeholder="https://restaurant.com/menu"
                type="text"
                name="addElementButtonLink"
              />
            </>
          ) : addFormType === ElementTypes.LINK_GROUP ? (
            <>
              <div className={styles.spaceBetweenContainer}>
                <label>{t("elementTypeOptions.link_group.link1.label")}</label>
              </div>
              <input
                placeholder="https://restaurant.com/menu"
                type="text"
                name="addElementGroupLink1"
              />
              <select name="linkGroupImageType1">
                <option value="">
                  {t("elementTypeOptions.link_group.link1.selectMessage")}
                </option>
                <option value={LinkGroupImageType.FACEBOOK}>Facebook</option>
                <option value={LinkGroupImageType.INSTAGRAM}>Instagram</option>
                <option value={LinkGroupImageType.LINKEDIN}>Linkedin</option>
                <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                <option value={LinkGroupImageType.X}>X</option>
                <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                <option value={LinkGroupImageType.WEBSITE}>Website</option>
                <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
              </select>
              {linkGroupCount > 1 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>
                      {t("elementTypeOptions.link_group.link2.label")}
                    </label>
                    {linkGroupCount === 2 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink2"
                  />
                  <select name="linkGroupImageType2">
                    <option value="">
                      {t("elementTypeOptions.link_group.link2.selectMessage")}
                    </option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 2 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>
                      {t("elementTypeOptions.link_group.link3.label")}
                    </label>
                    {linkGroupCount === 3 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink3"
                  />
                  <select name="linkGroupImageType3">
                    <option value="">
                      {t("elementTypeOptions.link_group.link3.selectMessage")}
                    </option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 3 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>
                      {t("elementTypeOptions.link_group.link4.label")}
                    </label>
                    {linkGroupCount === 4 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink4"
                  />
                  <select name="linkGroupImageType4">
                    <option value="">
                      {t("elementTypeOptions.link_group.link4.selectMessage")}
                    </option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 4 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>
                      {t("elementTypeOptions.link_group.link5.label")}
                    </label>
                    {linkGroupCount === 5 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink5"
                  />
                  <select name="linkGroupImageType5">
                    <option value="">
                      {t("elementTypeOptions.link_group.link5.selectMessage")}
                    </option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              <button
                type="button"
                onClick={() => {
                  if (linkGroupCount > 4) {
                    toast.error("Only 5 links can be added");
                    return;
                  }
                  setLinkGroupCount(linkGroupCount + 1);
                }}
                disabled={linkGroupCount > 4}
              >
                {`+ ${t("elementTypeOptions.link_group.addLink")}`}
              </button>
              {linkGroupCount === 5 ? (
                <p className={styles.discreteText}>
                  {t("elementTypeOptions.link_group.maximumReached")}
                </p>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <button type="submit" disabled={!addFormType}>
          {t("addElement")}
        </button>
      </form>
    </>
  );
}
