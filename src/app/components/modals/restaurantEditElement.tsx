import styles from "@/styles/components/modals/element.module.sass";
import IEditElement from "@/types/editElement.interface";
import axios from "axios";
import toast from "react-hot-toast";
import CurrentElementData from "../currentElementData";
import { useState } from "react";

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
        case 1:
          break;
        case 2:
          const elementVideoLink = (
            form.elements.namedItem("editElementVideoLink") as HTMLInputElement
          ).value;

          if (elementVideoLink !== "")
            editElementObject.video_link = elementVideoLink;
          break;
        case 3:
          const elementImageLink = (
            form.elements.namedItem("editElementImageLink") as HTMLInputElement
          ).value;
          if (elementImageLink !== "")
            editElementObject.image_link = elementImageLink;
          break;
        case 4:
          const elementButtonLink = (
            form.elements.namedItem("editElementButtonLink") as HTMLInputElement
          ).value;
          if (elementButtonLink !== "")
            editElementObject.button_link = elementButtonLink;
          break;
        case 5:
        // TODO
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
        <label>Past Text:</label>
        <input type="text" placeholder={element.text} disabled />
        <label>New text:</label>
        <input
          type="text"
          name="editElementText"
          placeholder="New Text"
          onChange={() => setDisableEditButton(false)}
        />
        {element ? (
          element.type === 1 ? (
            ""
          ) : element.type === 2 ? (
            <>
              <label>Past video URL:</label>
              <input
                type="text"
                name="editElementVideoLink"
                placeholder={element.video_link}
                disabled
              />
              <label>New video URL:</label>
              <input
                type="text"
                name="editElementVideoLink"
                placeholder="https://youtube.com/sdf..dsfsd"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : element.type === 3 ? (
            <>
              <label>Past image URL:</label>
              <input
                type="text"
                name="editElementImageLink"
                placeholder={element.image_link}
                disabled
              />
              <label>New image URL:</label>
              <input
                type="text"
                name="editElementImageLink"
                placeholder="https://restaurant.com/gallery/1.jpg"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : element.type === 4 ? (
            <>
              <label>Past link URL for button:</label>
              <input
                type="text"
                name="editElementButtonLink"
                placeholder={element.button_link}
                disabled
              />
              <label>New link URL for button:</label>
              <input
                type="text"
                name="editElementButtonLink"
                placeholder="https://restaurant.com/menu"
                onChange={() => setDisableEditButton(false)}
              />
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
        {disableEditButton ? <p>Type some value to edit</p> : ""}
      </form>
    </div>
  );
}
