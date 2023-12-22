import modalStyles from "@/styles/components/modal.module.sass";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";
import Image from "next/image";
import { AddViewModal } from "./modals/addView";
import { AdminEditElementModal } from "./modals/adminEditElement";
import { AddElementModal } from "./modals/addElement";
import { AddRestaurantModal } from "./modals/addRestaurant";
import { RestaurantEditElementModal } from "./modals/restaurantEditElement";

interface ModalProps {
  visibleModal: boolean;
  setVisibleModal: Function;
  modalPurpose: ModalPurpose | undefined;
  setObjects: Function;
  pastObjects: any[];
  view?: any;
  currentEditElement?: any;
  setAddFormType?: Function;
  addFormType?: number;
  restaurantId?: string;
  setEditingView?: Function;
}

export function Modal({
  visibleModal,
  setVisibleModal,
  setObjects,
  pastObjects,
  modalPurpose,
  currentEditElement,
  view,
  setAddFormType,
  addFormType,
  restaurantId,
  setEditingView,
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
                  setRestaurants={setObjects}
                  restaurants={pastObjects}
                />
              ) : modalPurpose === ModalPurpose.CREATE_VIEW ? (
                <AddViewModal
                  setVisibleModal={setVisibleModal}
                  views={pastObjects}
                  setViews={setObjects}
                  restaurantId={restaurantId!}
                  setEditingView={setEditingView!}
                />
              ) : modalPurpose === ModalPurpose.ADD_ELEMENT ? (
                <AddElementModal
                  setVisibleModal={setVisibleModal}
                  view={view}
                  setCurrentElements={setObjects}
                  currentElements={pastObjects}
                  setAddFormType={setAddFormType!}
                  addFormType={addFormType!}
                />
              ) : modalPurpose === ModalPurpose.ADMIN_EDIT_ELEMENT ? (
                <AdminEditElementModal
                  setVisibleModal={setVisibleModal}
                  currentEditElement={currentEditElement}
                  setCurrentElements={setObjects}
                  currentElements={pastObjects}
                />
              ) : modalPurpose === ModalPurpose.RESTAURANT_EDIT_ELEMENT ? (
                <RestaurantEditElementModal
                  setVisibleModal={setVisibleModal}
                  element={currentEditElement}
                  currentElements={pastObjects}
                  setCurrentElements={setObjects}
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
