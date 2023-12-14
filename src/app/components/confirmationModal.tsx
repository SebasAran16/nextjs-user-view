import styles from "@/styles/components/confirmation-modal.module.sass";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ConfirmationProps {
  element: any | undefined;
  setUpdateElements: Function;
  setElementToRemove: Function;
}

export function ConfirmationModal({
  element,
  setUpdateElements,
  setElementToRemove,
}: ConfirmationProps) {
  return (
    <section id={styles.confirmationContainer} className={styles.hidden}>
      <div id={styles.confirmationModal}>
        <p>Element will be removed, do you want to continue?</p>
        <div>
          <button
            onClick={(e) => {
              const button = e.currentTarget;
              const modal = button.parentElement?.parentElement?.parentElement;
              modal?.classList.add(styles.hidden);
            }}
          >
            Cancel
          </button>
          <button
            onClick={async (e) => {
              try {
                if (typeof element === "undefined")
                  toast.error("No element chosen");

                const button = e.currentTarget;
                const modal =
                  button.parentElement?.parentElement?.parentElement;
                modal?.classList.add(styles.hidden);

                const removeResponse = await axios.post(
                  "/api/view-elements/remove",
                  { id: element._id }
                );

                if (removeResponse.status !== 200)
                  throw new Error(removeResponse.data.message);

                setUpdateElements(true);
                setElementToRemove(undefined);
                modal?.classList.add(styles.hidden);
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
  );
}
