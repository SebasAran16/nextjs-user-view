"use client";
import styles from "@/styles/components/elements-box.module.sass";
import modalStyles from "@/styles/components/modal.module.sass";
import getTypeFromNumber from "@/utils/getTypeFromNumber";
import INewElement from "@/types/newElement.interface";
import { ModalAction } from "@/utils/structs/modals.enum";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import getSortedElements from "@/utils/getSortedElements";
import Image from "next/image";
import IEditElement from "@/types/editElement.interface";
import CurrentElementData from "./currentElementData";

interface ElementsBoxProps {
  view: any;
}

export default function ElementsBox({ view }: ElementsBoxProps) {
  enum DragHoverAction {
    ENTER,
    EXIT,
  }

  enum ModalPurpose {
    ADD_ELEMENT = "ADD_ELEMENT",
    EDIT_ELEMENT = "EDIT_ELEMENT",
  }

  const dragItem = useRef<number | undefined>(undefined);
  const dragOverItem = useRef<number | undefined>(undefined);

  const [currentElements, setCurrentElements] = useState<any | undefined>();
  const [updateElements, setUpdateElements] = useState(true);
  const [modalPurpose, setModalPurpose] = useState<ModalPurpose | undefined>(
    undefined
  );
  const [addFormType, setAddFormType] = useState<number | undefined>();
  const [currentEditElement, setCurrentEditElement] = useState<
    any | undefined
  >();
  const [disableEditButton, setDisableEditButton] = useState(true);

  useEffect(() => {
    try {
      axios
        .post("/api/view-elements/get-for-view", {
          view_id: view._id,
        })
        .then((elementsResponse) => {
          if (elementsResponse.status !== 200)
            throw new Error(elementsResponse.data.message);

          const elements = elementsResponse.data.elements;

          setCurrentElements(getSortedElements(elements));
        })
        .catch((err) => {
          console.log(err);
          if (axios.isAxiosError(err)) toast.error(err.message);
        });
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.message);
    } finally {
      setUpdateElements(false);
    }
  }, [updateElements]);

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

  const handleSwap = async () => {
    let _elements = [...currentElements];

    // TODO Only continue if positions have been changed

    const movedElement = _elements[dragOverItem.current!];
    const draggedElement = _elements.splice(dragItem.current!, 1)[0];
    _elements.splice(dragOverItem.current!, 0, draggedElement);

    dragItem.current = undefined;
    dragOverItem.current = undefined;

    const movedElementObject = {
      id: movedElement._id,
      position: draggedElement.position,
    };
    const draggedElementObject = {
      id: draggedElement._id,
      position: movedElement.position,
    };

    const elementEditAPIPath = "/api/view-elements/edit";
    const movedElementEditResponse = await axios.post(
      elementEditAPIPath,
      movedElementObject
    );
    const draggedElementEditResponse = await axios.post(
      elementEditAPIPath,
      draggedElementObject
    );

    if (
      movedElementEditResponse.status !== 200 ||
      draggedElementEditResponse.status !== 200
    ) {
      if (movedElementEditResponse.status !== 200)
        throw new Error(movedElementEditResponse.data.message);

      if (draggedElementEditResponse.status !== 200)
        throw new Error(draggedElementEditResponse.data.message);
    }

    setUpdateElements(true);
    toast.success("Element positions changed correctly");
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
      const elementText = (
        form.elements.namedItem("addElementText") as HTMLInputElement
      ).value;

      const addElementObject: INewElement = {
        view_id: view._id,
        name: elementName,
        type: elementType,
        text: elementText,
      };

      switch (elementType) {
        case 1:
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

      setUpdateElements(true);
      toggleElemenstModal(ModalAction.CLOSE, ModalPurpose.ADD_ELEMENT);
      toast.success(addResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue adding the element");
    }
  };

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

      const addResponse = await axios.post(
        "/api/view-elements/edit",
        editElementObject
      );

      if (addResponse.status !== 200) throw new Error(addResponse.data.message);

      setUpdateElements(true);
      toggleElemenstModal(ModalAction.CLOSE, ModalPurpose.ADD_ELEMENT);
      setDisableEditButton(true);
      toast.success(addResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue editing the element");
    }
  };

  return (
    <>
      <Toaster />
      <section id={styles.elementsBox}>
        <Image src={view.image} alt="View Image" width="64" height="64" />
        <p>
          Visible at:{" "}
          <a
            href={`https://customerview.app/view/${view.url}`}
            target="_blank"
          >{`https://customerview.app/view/${view.url}`}</a>
        </p>
        <div id={styles.headerSection}>
          <h2>View's Elements:</h2>
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
          {currentElements ? (
            currentElements.length > 0 ? (
              currentElements.map((element: any, index: number) => (
                <div
                  key={index}
                  className={styles.dndElement}
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) =>
                    onDragHover(e, index, DragHoverAction.ENTER)
                  }
                  onDragLeaveCapture={(e) =>
                    onDragHover(e, index, DragHoverAction.EXIT)
                  }
                  onDragEnd={handleSwap}
                  // onDragOver={(e) => e.preventDefault()}
                >
                  <div>
                    <h3>{element.name}</h3>
                    <p>{getTypeFromNumber(element.type)}</p>
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
                      Manage
                    </button>
                    <button>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              "Your added elements will show here."
            )
          ) : (
            <Image
              src="/icons/loader.gif"
              alt="Loader Icon"
              height="28"
              width="28"
            />
          )}
        </div>
      </section>
      <section id={modalStyles.modalContainer} className={modalStyles.hidden}>
        <div id={styles.modal}>
          <div>
            <Image
              src="icons/close-main-color.svg"
              alt="Close Icon"
              height="34"
              width="34"
              onClick={() =>
                toggleElemenstModal(ModalAction.CLOSE, ModalPurpose.ADD_ELEMENT)
              }
            />
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
                    required
                  />
                  <label>Element Type:</label>
                  <select
                    onChange={(e) => {
                      const selectedValue = e.target.value;

                      if (selectedValue !== "")
                        setAddFormType(parseInt(selectedValue));
                    }}
                    value={addFormType}
                    name="addElementType"
                    required
                  >
                    <option value="">Please Choose a Type</option>
                    <option value="1">Text</option>
                    <option value="2">Video</option>
                    <option value="3">Image</option>
                    <option value="4">Link Button</option>
                    {/* TODO Add link button component */}
                  </select>
                  <label>Text:</label>
                  <input
                    placeholder="New Offer!"
                    type="text"
                    name="addElementText"
                    required
                  />
                  {addFormType ? (
                    addFormType === 1 ? (
                      ""
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
            )
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
}
