import styles from "@/styles/components/modals/element.module.sass";
import IEditElement from "@/types/editElement.interface";
import axios from "axios";
import toast from "react-hot-toast";
import CurrentElementData from "../currentElementData";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ElementTypes from "@/utils/elementsStruct";
import { LinkGroupImageType } from "@/types/structs/linkGroupImageType";

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
          if (elementButtonLink !== "")
            editElementObject.button_link = elementButtonLink;
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
      <h2>Edit Element:</h2>
      <form onSubmit={handleEditElementSubmit}>
        <label>New text:</label>
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
              <label>New video URL:</label>
              <input
                type="text"
                name="editElementVideoLink"
                placeholder="https://youtube.com/sdf..dsfsd"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : element.type === ElementTypes.IMAGE ? (
            <>
              <label>New image URL:</label>
              <input
                type="text"
                name="editElementImageLink"
                placeholder="https://restaurant.com/gallery/1.jpg"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : element.type === ElementTypes.LINK ? (
            <>
              <label>New link URL for button:</label>
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
                    <label>{`New link ${clientIndex}:`}</label>
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
                      <option value="">{`Select New Link ${clientIndex} Image Type`}</option>
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
            "Element type not allowed"
          )
        ) : (
          ""
        )}
        <button type="submit" disabled={disableEditButton}>
          Edit Element
        </button>
        {disableEditButton ? (
          <p className={styles.discreteText}>Type some value to edit</p>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
