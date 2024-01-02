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

  const handleEditElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;

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
          const elementVideoLink = (
            form.elements.namedItem("editElementVideoLink") as HTMLInputElement
          ).value;

          if (elementVideoLink !== "")
            editElementObject.video_link = elementVideoLink;
          break;
        case ElementTypes.IMAGE:
          const elementImageLink = (
            form.elements.namedItem("editElementImageLink") as HTMLInputElement
          ).value;
          if (elementImageLink !== "")
            editElementObject.image_link = elementImageLink;
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
      setVisibleModal(false);
      setDisableEditButton(true);
      toast.success(editResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue editing the element");
    }
  };

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
              <input
                type="text"
                name="editElementVideoLink"
                placeholder="https://youtube.com/sdf..dsfsd"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : element.type === ElementTypes.IMAGE ? (
            <>
              <label>{t("newImage")}</label>
              <input
                type="text"
                name="editElementImageLink"
                placeholder="https://restaurant.com/gallery/1.jpg"
                onChange={() => setDisableEditButton(false)}
              />
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
