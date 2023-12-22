import styles from "@/styles/components/modals/element.module.sass";
import IEditElement from "@/types/editElement.interface";
import axios from "axios";
import toast from "react-hot-toast";
import CurrentElementData from "../currentElementData";
import { useState } from "react";

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
  const [disableEditButton, setDisableEditButton] = useState(true);

  const handleEditElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;

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

      const indexToSwap = currentElements.indexOf(currentEditElement);
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
      <CurrentElementData element={currentEditElement} />
      <h2>Edit Element:</h2>
      <form onSubmit={handleEditElementSubmit}>
        <label>New name:</label>
        <input
          type="text"
          name="editElementName"
          placeholder="Modified name"
          onChange={() => setDisableEditButton(false)}
        />
        <label>New text:</label>
        <input
          type="text"
          name="editElementText"
          placeholder="New Text"
          onChange={() => setDisableEditButton(false)}
        />
        {currentEditElement ? (
          currentEditElement.type === 1 ? (
            ""
          ) : currentEditElement.type === 2 ? (
            <>
              <label>New video URL:</label>
              <input
                type="text"
                name="editElementVideoLink"
                placeholder="https://youtube.com/sdf..dsfsd"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : currentEditElement.type === 3 ? (
            <>
              <label>New image URL:</label>
              <input
                type="text"
                name="editElementImageLink"
                placeholder="https://restaurant.com/gallery/1.jpg"
                onChange={() => setDisableEditButton(false)}
              />
            </>
          ) : currentEditElement.type === 4 ? (
            <>
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
