"use client";
import styles from "@/styles/components/elements-box.module.sass";
import confirmationModalStyles from "@/styles/components/confirmation-modal.module.sass";
import modalStyles from "@/styles/components/modal.module.sass";
import getTypeFromNumber from "@/utils/getTypeFromNumber";
import { ModalAction } from "@/utils/structs/modalActions.enum";
import { ModalPurpose } from "@/utils/structs/modalPurposes.enum";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import getSortedElements from "@/utils/getSortedElements";
import Image from "next/image";
import { ConfirmationModal } from "./confirmationModal";
import { Modal } from "./modal";

interface ElementsBoxProps {
  view: any;
}

export default function ElementsBox({ view }: ElementsBoxProps) {
  enum DragHoverAction {
    ENTER,
    EXIT,
  }

  const dragItem = useRef<number | undefined>(undefined);
  const dragOverItem = useRef<number | undefined>(undefined);

  const [currentElements, setCurrentElements] = useState<any | undefined>();
  const [updateElements, setUpdateElements] = useState(true);
  const [modalPurpose, setModalPurpose] = useState<ModalPurpose | undefined>(
    undefined
  );
  const [addFormType, setAddFormType] = useState<number | undefined>();
  const [elementToRemove, setElementToRemove] = useState<any | undefined>();
  const [visibleModal, setVisibleModal] = useState(false);
  const [currentEditElement, setCurrentEditElement] = useState<
    any | undefined
  >();

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
  }, [view, updateElements]);

  useEffect(() => {
    const confirmationContainer = document.querySelector(
      "#" + confirmationModalStyles.confirmationContainer
    );

    if (elementToRemove) {
      confirmationContainer?.classList.remove(confirmationModalStyles.hidden);
    } else {
      confirmationContainer?.classList.add(confirmationModalStyles.hidden);
    }
  }, [elementToRemove]);

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

  return (
    <>
      <Toaster />
      <section id={styles.elementsBox}>
        <Image src={view.image} alt="View Image" width="64" height="64" />
        <button>Eliminate View</button>
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
            onClick={() => {
              setModalPurpose(ModalPurpose.ADD_ELEMENT);
              setVisibleModal(true);
            }}
          >
            Add Element
          </button>
        </div>
        <hr />
        <div id={styles.elementsContainer}>
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
                      onClick={() => {
                        setModalPurpose(ModalPurpose.EDIT_ELEMENT);
                        setCurrentEditElement(element);
                        setVisibleModal(true);
                      }}
                    >
                      Manage
                    </button>
                    <button onClick={() => setElementToRemove(element)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div id={styles.defaultViewNoElements}>
                <p>Your added elements will show here.</p>
              </div>
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
      <Modal
        modalPurpose={modalPurpose}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        view={view}
        currentEditElement={currentEditElement}
        setUpdateElements={setUpdateElements}
        setAddFormType={setAddFormType}
        addFormType={addFormType}
      />
      <ConfirmationModal
        element={elementToRemove}
        setUpdateElements={setUpdateElements}
        setElementToRemove={setElementToRemove}
      />
    </>
  );
}
