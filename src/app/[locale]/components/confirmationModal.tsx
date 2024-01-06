import styles from "@/styles/components/confirmation-modal.module.sass";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Object } from "@/types/structs/object.enum";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useTranslations } from "next-intl";
import { deleteAmazonObject } from "@/utils/amzS3/deleteAmzObject";
import { getS3ObjectKeyFromObject } from "@/utils/amzS3/getS3ObjectKeyFromObject";

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
  const t = useTranslations("Modals.ConfirmationModal");

  const removeObject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (typeof object === "undefined") {
        toast.error(`No ${objectType} chosen`);
        return;
      }

      const button = e.currentTarget;
      const modal = button.parentElement?.parentElement?.parentElement;
      modal?.classList.add(styles.hidden);

      const removeResponse = await axios.post(`/api/${objectType}s/remove`, {
        id: object._id,
      });

      if (removeResponse.status !== 200)
        throw new Error(removeResponse.data.message);

      // see if we should delete objects3
      const deleteS3ObjectResponse = await deleteAmazonObject(
        getS3ObjectKeyFromObject(object, objectType!)
      );

      if (!deleteS3ObjectResponse.success) {
        toast.error(deleteS3ObjectResponse.errorMessage);
      }

      setObjects(
        pastObjects.filter(
          (existentObject) => existentObject._id !== object._id
        )
      );

      if (objectType === Object.VIEW && setEditingView)
        setEditingView(undefined);

      toast.success(removeResponse.data.message);
      setVisibleConfirmation(false);
    } catch (err: any) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else {
        toast.error(t("removeErrorMessage"));
      }
    }
  };

  return (
    <>
      {visibleConfirmation ? (
        <section id={styles.confirmationContainer}>
          <div id={styles.confirmationModal}>
            <p>
              {capitalizeFirstLetter(objectType!)}
              {t("removeConfirmation")}
            </p>
            <div>
              <button
                onClick={() => {
                  setVisibleConfirmation(false);
                }}
              >
                {t("cancel")}
              </button>
              <button onClick={removeObject}>{t("confirm")}</button>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}
