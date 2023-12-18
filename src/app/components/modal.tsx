import modalStyles from "@/styles/components/modal.module.sass";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";
import Image from "next/image";
import { useState } from "react";
import { AddViewModal } from "./modals/addView";
import { ManageElementModal } from "./modals/manageElement";
import { AddElementModal } from "./modals/addElement";
import { AddRestaurantModal } from "./modals/addRestaurant";

interface ModalProps {
  visibleModal: boolean;
  setVisibleModal: Function;
  modalPurpose: ModalPurpose | undefined;
  setViews?: Function;
  view?: any;
  currentEditElement?: any;
  setUpdateElements?: Function;
  setAddFormType?: Function;
  addFormType?: number;
  setUpdateRestaurants?: Function;
}

export function Modal({
  visibleModal,
  setVisibleModal,
  modalPurpose,
  setViews,
  currentEditElement,
  setUpdateElements,
  view,
  setAddFormType,
  addFormType,
  setUpdateRestaurants,
}: ModalProps) {
  return (
    <>
      {visibleModal ? (
        <section id={modalStyles.modalContainer}>
          <div id={modalStyles.modal}>
            <div>
              <Image
                src="/icons/close-main-color.svg"
                alt="Close Icon"
                height="34"
                width="34"
                onClick={() => setVisibleModal(false)}
              />
            </div>
            <div>
              {modalPurpose === ModalPurpose.ADD_RESTAURANT ? (
                <AddRestaurantModal
                  setVisibleModal={setVisibleModal}
                  setUpdateRestaurants={setUpdateRestaurants!}
                />
              ) : modalPurpose === ModalPurpose.CREATE_VIEW ? (
                <AddViewModal
                  setVisibleModal={setVisibleModal}
                  setViews={setViews!}
                />
              ) : modalPurpose === ModalPurpose.ADD_ELEMENT ? (
                <AddElementModal
                  setVisibleModal={setVisibleModal}
                  view={view}
                  setUpdateElements={setUpdateElements!}
                  setAddFormType={setAddFormType!}
                  addFormType={addFormType!}
                />
              ) : modalPurpose === ModalPurpose.EDIT_ELEMENT ? (
                <ManageElementModal
                  setVisibleModal={setVisibleModal}
                  currentEditElement={currentEditElement}
                  setUpdateElements={setUpdateElements!}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}
