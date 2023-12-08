"use client";
import styles from "@/styles/dashboard.module.sass";
import modalStyles from "@/styles/components/modal.module.sass";
import { useGlobalState } from "@/utils/globalStates";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ModalAction } from "@/utils/structs/modals.enum";
import ElementsBox from "../components/elementsBox";
import ViewsBox from "../components/viewsBox";

export default function Dashboard() {
  enum ModalPurpose {
    CREATE_VIEW = "CREATE_VIEW",
  }

  const [user] = useGlobalState("userData");
  const [views, setViews] = useState<any | undefined>();
  const [modalAction, setModalAction] = useState<ModalAction | undefined>();
  const [modalPurpose, setModalPurpose] = useState<ModalPurpose | undefined>();

  useEffect(() => {
    axios
      .get("/api/view/search")
      .then((viewsResponse) => {
        if (viewsResponse.status !== 200)
          throw new Error(viewsResponse.data.message);

        const views = viewsResponse.data.views;
        setViews(views);
      })
      .catch((err: any) => {
        console.log(err);
        toast.error("Could not get Views");
      });
  }, [views]);

  const toggleModal = (
    action: ModalAction,
    purpose: ModalPurpose | undefined = undefined
  ) => {
    const modal = document.querySelector("#" + modalStyles.modalContainer);

    if (purpose === ModalPurpose.CREATE_VIEW) {
      setModalPurpose(ModalPurpose.CREATE_VIEW);
    }

    if (action === ModalAction.OPEN) {
      modal?.classList.remove(modalStyles.hidden);
    } else {
      modal?.classList.add(modalStyles.hidden);
    }
  };

  const handleCreateView = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const form = e.currentTarget;

      const newViewName = (
        form.elements.namedItem("newViewName") as HTMLInputElement
      ).value;
      const newViewUrl = (
        form.elements.namedItem("newViewUrl") as HTMLInputElement
      ).value;

      const createViewResponse = await axios.post("api/view/add", {
        name: newViewName,
        url: newViewUrl,
      });

      if (createViewResponse.status !== 200)
        throw new Error(createViewResponse.data.message);

      toggleModal(ModalAction.CLOSE);
      setViews([]);
      toast.success(createViewResponse.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section>
      <div>
        <button
          onClick={() =>
            toggleModal(ModalAction.OPEN, ModalPurpose.CREATE_VIEW)
          }
        >
          Create a View
        </button>
        <h2>These are your current active views:</h2>
        <ViewsBox views={views} />
      </div>
      <section id={modalStyles.modalContainer} className={modalStyles.hidden}>
        <div id={styles.modal}>
          <div>
            <button
              onClick={() =>
                toggleModal(ModalAction.CLOSE, ModalPurpose.CREATE_VIEW)
              }
            >
              Close
            </button>
          </div>
          <div>
            {modalPurpose === ModalPurpose.CREATE_VIEW ? (
              <>
                <h2>Create a View:</h2>
                <form onSubmit={handleCreateView}>
                  <label>View Name:</label>
                  <input
                    placeholder="McDonalds View"
                    type="text"
                    name="newViewName"
                  />
                  <label>View URL:</label>
                  <input
                    placeholder="mc-donalds"
                    type="text"
                    name="newViewUrl"
                  />
                  <button type="submit">Create</button>
                </form>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
