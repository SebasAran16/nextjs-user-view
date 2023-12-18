import styles from "@/styles/components/confirmation-modal.module.sass";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Object } from "@/types/structs/object.enum";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface ConfirmationProps {
  object: any | undefined;
  objectType: Object;
  visibleConfirmation: boolean;
  setVisibleConfirmation: Function;
  setUpdateRestaurants?: Function;
  setUpdateElements?: Function;
  setElementToRemove?: Function;
}

export function ConfirmationModal({
  visibleConfirmation,
  setVisibleConfirmation,
  objectType,
  object,
  setUpdateRestaurants,
  setUpdateElements,
}: ConfirmationProps) {
  console.log(visibleConfirmation);
  return (
    <>
      {visibleConfirmation ? (
        <section id={styles.confirmationContainer}>
          <div id={styles.confirmationModal}>
            <p>
              {capitalizeFirstLetter(objectType) +
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

                    if (objectType === Object.ELEMENT && setUpdateElements) {
                      setUpdateElements(true);
                    } else if (
                      objectType === Object.RESTAURANT &&
                      setUpdateRestaurants
                    ) {
                      setUpdateRestaurants(true);
                    }

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
