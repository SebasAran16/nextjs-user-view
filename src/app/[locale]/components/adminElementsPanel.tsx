import styles from "@/styles/components/admin-elements-panel.module.sass";
import getTypeFromNumber from "@/utils/getTypeFromNumber";
import axios from "axios";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Object } from "@/types/structs/object.enum";
import { Modal } from "./modal";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";
import { ConfirmationModal } from "./confirmationModal";
import { useTranslations } from "next-intl";

interface AdminElementsPanelProps {
  elements: any[];
  setCurrentElements: Function;
  view: any;
}

export function AdminElementsPanel({
  elements,
  setCurrentElements,
  view,
}: AdminElementsPanelProps) {
  const t = useTranslations(
    "Dashboard.Components.Restaurants.ElementsBox.AdminElementsPanel"
  );

  enum DragHoverAction {
    ENTER,
    EXIT,
  }

  const dragItem = useRef<number | undefined>(undefined);
  const dragOverItem = useRef<number | undefined>(undefined);

  const [addFormType, setAddFormType] = useState<number | undefined>();
  const [currentEditElement, setCurrentEditElement] = useState<
    any | undefined
  >();
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalPurpose, setModalPurpose] = useState<ModalPurpose | undefined>(
    undefined
  );
  const [elementToRemove, setElementToRemove] = useState<any | undefined>();
  const [visibleConfirmation, setVisibleConfirmation] = useState(false);

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
    let _elements = [...elements];

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

    const elementEditAPIPath = "/api/elements/edit";
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

    setCurrentElements(_elements);
    toast.success("Element positions changed correctly");
  };

  return (
    <section id={styles.adminPanelContainer}>
      <button
        onClick={() => {
          setModalPurpose(ModalPurpose.ADD_ELEMENT);
          setVisibleModal(true);
        }}
      >
        + {t("add")}
      </button>
      {elements ? (
        elements.length > 0 ? (
          elements.map((element: any, index: number) => (
            <div
              key={index}
              className={styles.dndElement}
              draggable
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => onDragHover(e, index, DragHoverAction.ENTER)}
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
                    setModalPurpose(ModalPurpose.ADMIN_EDIT_ELEMENT);
                    setCurrentEditElement(element);
                    setVisibleModal(true);
                  }}
                >
                  {t("manage")}
                </button>
                <button
                  onClick={() => {
                    setElementToRemove(element);
                    setVisibleConfirmation(true);
                  }}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div id={styles.defaultViewNoElements}>
            <p>{t("noElementsMessage")}</p>
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
      <Modal
        modalPurpose={modalPurpose}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        currentEditElement={currentEditElement}
        pastObjects={elements}
        view={view}
        setObjects={setCurrentElements}
        setAddFormType={setAddFormType}
        addFormType={addFormType}
      />
      <ConfirmationModal
        object={elementToRemove}
        objectType={Object.ELEMENT}
        pastObjects={elements}
        setObjects={setCurrentElements}
        visibleConfirmation={visibleConfirmation}
        setVisibleConfirmation={setVisibleConfirmation}
      />
    </section>
  );
}
