import styles from "@/styles/components/confirmation-modal.module.sass";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Object } from "@/types/structs/object.enum";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface ConfirmationProps {
  object: any | undefined;
  objectType?: Object;
  visibleConfirmation: boolean;
  setVisibleConfirmation: Function;
  setObjects: Function;
  pastObjects: any[];
  setUpdateRestaurants?: Function;
  setEditingView?: Function;
}

export function ConfirmationModal({
  visibleConfirmation,
  setVisibleConfirmation,
  objectType,
  object,
  setObjects,
  pastObjects,
  setEditingView,
}: ConfirmationProps) {
  return (
    <>
      {visibleConfirmation ? (
        <section id={styles.confirmationContainer}>
          <div id={styles.confirmationModal}>
            <p>
              {capitalizeFirstLetter(objectType!) +
                " will be removed, do you want to continue?"}
            </p>
            <div>
              <button
                onClick={() => {
                  setVisibleConfirmation(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={async (e) => {
                  try {
                    if (typeof object === "undefined")
                      toast.error(`No ${objectType} chosen`);

                    const button = e.currentTarget;
                    const modal =
                      button.parentElement?.parentElement?.parentElement;
                    modal?.classList.add(styles.hidden);

                    const removeResponse = await axios.post(
                      `/api/${objectType}s/remove`,
                      { id: object._id }
                    );

                    if (removeResponse.status !== 200)
                      throw new Error(removeResponse.data.message);

                    setObjects(
                      pastObjects.filter(
                        (existentObject) => existentObject._id !== object._id
                      )
                    );

                    if (objectType === Object.VIEW && setEditingView)
                      setEditingView(undefined);

                    setVisibleConfirmation(false);
                    toast.success(removeResponse.data.message);
                  } catch (err) {
                    console.log(err);
                    toast.error("Could not remove element");
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}
