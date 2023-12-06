"use client";
import styles from "@/styles/components/elements-box.module.sass";
import React, { useRef, useState } from "react";

export default function ElementsBox() {
  const [list, setList] = useState(["hey", "is", "Mario", "me"]);
  const dragItem = useRef<number | undefined>(undefined);
  const dragOverItem = useRef<number | undefined>(undefined);

  const [modalPurpose, setModalPurpose] = useState<ModalPurpose | undefined>(
    undefined
  );

  enum DragHoverAction {
    ENTER,
    EXIT,
  }

  enum ModalAction {
    OPEN,
    CLOSE,
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

  const toggleElemenstModal = (action: ModalAction, purpose: ModalPurpose) => {
    const modal = document.querySelector("#" + styles.modalContainer);

    if (action === ModalAction.OPEN) {
      modal?.classList.remove(styles.hidden);
    } else {
      modal?.classList.add(styles.hidden);
    }

    if (purpose === ModalPurpose.ADD_ELEMENT) {
      setModalPurpose(ModalPurpose.ADD_ELEMENT);
    } else if (purpose === ModalPurpose.EDIT_ELEMENT) {
      setModalPurpose(ModalPurpose.EDIT_ELEMENT);
    }
  };

  return (
    <>
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
                  <p>{element}</p>
                  <button
                    onClick={() =>
                      toggleElemenstModal(
                        ModalAction.OPEN,
                        ModalPurpose.EDIT_ELEMENT
                      )
                    }
                  >
                    Edit Element
                  </button>
                </div>
              ))
            : "Loading..."}
        </div>
      </section>
      <section id={styles.modalContainer} className={styles.hidden}>
        <div id={styles.modal}>
          <div>
            <h2>Modal</h2>
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
              </div>
            ) : (
              <div className={styles.ModalActionContainer}>
                <h2>Edit Element:</h2>
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
