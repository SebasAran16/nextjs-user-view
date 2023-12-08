"use client";
import data from "@/data";
import styles from "@/styles/components/elements-box.module.sass";
import modalStyles from "@/styles/components/modal.module.sass";
import getTypeFromNumber from "@/utils/getTypeFromNumber";
import INewElement from "@/types/newElement.interface";
import { ModalAction } from "@/utils/structs/modals.enum";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function ElementsBox() {
  const [list, setList] = useState(data);
  const dragItem = useRef<number | undefined>(undefined);
  const dragOverItem = useRef<number | undefined>(undefined);

  const [modalPurpose, setModalPurpose] = useState<ModalPurpose | undefined>(
    undefined
  );
  const [addFormType, setAddFormType] = useState<number | undefined>();
  const [currentEditElement, setCurrentEditElement] = useState<
    any | undefined
  >();

  enum DragHoverAction {
    ENTER,
    EXIT,
  }

  enum ModalPurpose {
    ADD_ELEMENT = "ADD_ELEMENT",
    EDIT_ELEMENT = "EDIT_ELEMENT",
  }

  const onDragHover = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
    action: DragHoverAction
  ) => {
    dragOverItem.current = index;

    const element = document.querySelectorAll("." + styles.dndElement)[index];

    if (action === DragHoverAction.ENTER) {
      element.classList.add(styles.elementDragHover);
    } else {
      element.classList.remove(styles.elementDragHover);
    }
  };

  const handleSort = () => {
    let _items = [...list];

    const draggedItem = _items.splice(dragItem.current!, 1)[0];
    _items.splice(dragOverItem.current!, 0, draggedItem);

    dragItem.current = undefined;
    dragOverItem.current = undefined;

    setList(_items);
  };

  const toggleElemenstModal = (
    action: ModalAction,
    purpose: ModalPurpose,
    element: undefined | Object = undefined
  ) => {
    const modal = document.querySelector("#" + modalStyles.modalContainer);

    if (purpose === ModalPurpose.ADD_ELEMENT) {
      setModalPurpose(ModalPurpose.ADD_ELEMENT);
    } else if (purpose === ModalPurpose.EDIT_ELEMENT) {
      setCurrentEditElement(element);
      setModalPurpose(ModalPurpose.EDIT_ELEMENT);
    }

    if (action === ModalAction.OPEN) {
      modal?.classList.remove(modalStyles.hidden);
    } else {
      modal?.classList.add(modalStyles.hidden);
    }
  };

  const handleAddSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue !== "") setAddFormType(parseInt(selectedValue));
  };

  const handleAddElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const elementName = (
        form.elements.namedItem("addElementName") as HTMLInputElement
      ).value;
      const elementType = parseInt(
        (form.elements.namedItem("addElementType") as HTMLSelectElement).value
      );

      const addElementObject: INewElement = {
        name: elementName,
        type: elementType,
      };

      switch (elementType) {
        case 1:
          const elementText = (
            form.elements.namedItem("addElementText") as HTMLInputElement
          ).value;
          addElementObject.text = elementText;
          break;
        case 2:
          const elementVideoLink = (
            form.elements.namedItem("addElementVideoLink") as HTMLInputElement
          ).value;
          addElementObject.video_link = elementVideoLink;
          break;
        case 3:
          const elementImageLink = (
            form.elements.namedItem("addElementImageLink") as HTMLInputElement
          ).value;
          addElementObject.image_link = elementImageLink;
          break;
        case 4:
          const elementButtonLink = (
            form.elements.namedItem("addElementButtonLink") as HTMLInputElement
          ).value;
          addElementObject.button_link = elementButtonLink;
          break;
        case 5:
        // TODO
        default:
          throw new Error("Element type not valid");
      }

      const addResponse = await axios.post(
        "/api/view-elements/add",
        addElementObject
      );

      if (addResponse.status !== 200) throw new Error(addResponse.data.message);

      toggleElemenstModal(ModalAction.CLOSE, ModalPurpose.ADD_ELEMENT);
      toast.success(addResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue adding the element");
    }
  };

  return (
    <>
      <Toaster />
      <section id={styles.elementsBox}>
        <div id={styles.headerSection}>
          <h2>Website Elements:</h2>
          <button
            onClick={() =>
              toggleElemenstModal(ModalAction.OPEN, ModalPurpose.ADD_ELEMENT)
            }
          >
            Add Element
          </button>
        </div>
        <hr />
        <div>
          {list
            ? list.map((element, index) => (
                <div
                  className={styles.dndElement}
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) =>
                    onDragHover(e, index, DragHoverAction.ENTER)
                  }
                  onDragLeaveCapture={(e) =>
                    onDragHover(e, index, DragHoverAction.EXIT)
                  }
                  onDragEnd={handleSort}
                  // onDragOver={(e) => e.preventDefault()}
                >
                  <div>
                    <h3>{getTypeFromNumber(element.type)}</h3>
                    <p>{element.name}</p>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        toggleElemenstModal(
                          ModalAction.OPEN,
                          ModalPurpose.EDIT_ELEMENT,
                          element
                        )
                      }
                    >
                      Edit Element
                    </button>
                    <button>Delete</button>
                  </div>
                </div>
              ))
            : "Loading..."}
        </div>
      </section>
      <section id={modalStyles.modalContainer} className={modalStyles.hidden}>
        <div id={styles.modal}>
          <div>
            <button
              onClick={() =>
                toggleElemenstModal(ModalAction.CLOSE, ModalPurpose.ADD_ELEMENT)
              }
            >
              Close
            </button>
          </div>
          {modalPurpose ? (
            modalPurpose === ModalPurpose.ADD_ELEMENT ? (
              <div className={styles.ModalActionContainer}>
                <h2>Add Element:</h2>
                <form onSubmit={handleAddElementSubmit}>
                  <label>Element Name:</label>
                  <input
                    placeholder="ex Restaurant Menu"
                    type="text"
                    name="addElementName"
                  />
                  <label>Element Type:</label>
                  <select
                    onChange={handleAddSelectChange}
                    value={addFormType}
                    name="addElementType"
                  >
                    <option value="">Please Choose a Type</option>
                    <option value="1">Text</option>
                    <option value="2">Video</option>
                    <option value="3">Image</option>
                    <option value="4">Link Button</option>
                    {/* TODO Add link button component */}
                  </select>
                  {addFormType ? (
                    addFormType === 1 ? (
                      <>
                        <label>Text:</label>
                        <input
                          placeholder="New Offer!"
                          type="text"
                          name="addElementText"
                        />
                      </>
                    ) : addFormType === 2 ? (
                      <>
                        <label>Video Link:</label>
                        <input
                          placeholder="https://youtube.com/sdf..dsfsd"
                          type="text"
                          name="addElementVideoLink"
                        />
                      </>
                    ) : addFormType === 3 ? (
                      <>
                        <label>Image Link:</label>
                        <input
                          placeholder="https://restaurant.com/gallery/1.jpg"
                          type="text"
                          name="addElementImageLink"
                        />
                      </>
                    ) : addFormType === 4 ? (
                      <>
                        <label>Button Link:</label>
                        <input
                          placeholder="https://restaurant.com/menu"
                          type="text"
                          name="addElementButtonLink"
                        />
                      </>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  <button type="submit" disabled={!addFormType}>
                    Add Element
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.ModalActionContainer}>
                <h2>Edit Element:</h2>
                <form onSubmit={handleAddElementSubmit}>
                  {currentEditElement ? (
                    currentEditElement.type === 1 ? (
                      <>
                        <label>New text:</label>
                        <input />
                      </>
                    ) : currentEditElement.type === 2 ? (
                      <>
                        <label>New video URL:</label>
                        <input />
                      </>
                    ) : currentEditElement.type === 3 ? (
                      <>
                        <label>New image URL:</label>
                        <input />
                      </>
                    ) : currentEditElement.type === 4 ? (
                      <>
                        <label>New link URL for button:</label>
                        <input />
                      </>
                    ) : (
                      "Element type not allowed"
                    )
                  ) : (
                    ""
                  )}
                  <button type="submit" disabled={!addFormType}>
                    Edit Element
                  </button>
                </form>
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
}
