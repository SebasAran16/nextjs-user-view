import styles from "@/styles/components/restaurant-elements-panel.module.sass";
import React, { useState } from "react";
import { Modal } from "./modal";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";

interface RestaurantElementEditorProps {
  children: React.ReactNode;
  element: any;
  elements: any[];
  setCurrentElements: Function;
}

export function RestaurantElementEditor({
  children,
  element,
  elements,
  setCurrentElements,
}: RestaurantElementEditorProps) {
  const [visibleModal, setVisibleModal] = useState(false);

  return (
    <>
      <section id={styles.elementsEditor} onClick={() => setVisibleModal(true)}>
        {children}
      </section>
      <Modal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        modalPurpose={ModalPurpose.RESTAURANT_EDIT_ELEMENT}
        setObjects={setCurrentElements}
        pastObjects={elements}
        currentEditElement={element}
      />
    </>
  );
}
