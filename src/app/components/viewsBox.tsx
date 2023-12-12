"use client";
import styles from "@/styles/components/views-box.module.sass";
import modalStyles from "@/styles/components/modal.module.sass";
import { ModalAction } from "@/utils/structs/modals.enum";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ElementsBox from "./elementsBox";
import convertToBase64 from "@/utils/convertToBase64";
import Image from "next/image";
import get64BaseSize from "@/utils/getBase64Size";

interface ViewsBoxProps {
  views: any[];
}

export default function ViewsBox() {
  enum ModalPurpose {
    CREATE_VIEW = "CREATE_VIEW",
  }

  const [views, setViews] = useState<any | undefined>();
  const [editingView, setEditingView] = useState<any | undefined>();
  const [modalAction, setModalAction] = useState<ModalAction | undefined>();
  const [viewModalPurpose, setViewModalPurpose] = useState<
    ModalPurpose | undefined
  >();
  const [viewImageToCreate, setViewImageToCreate] = useState<
    string | undefined
  >();

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
    const modal = document.querySelector(".createModal");
    console.log(modal);

    if (purpose === ModalPurpose.CREATE_VIEW) {
      setViewModalPurpose(ModalPurpose.CREATE_VIEW);
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

      if (!viewImageToCreate)
        throw new Error("Please, upload view image to continue");

      const createViewResponse = await axios.post("api/view/add", {
        name: newViewName,
        url: newViewUrl,
        image: viewImageToCreate,
      });

      if (createViewResponse.status !== 200)
        throw new Error(createViewResponse.data.message);

      toggleModal(ModalAction.CLOSE);
      setViews([]);
      toast.success(createViewResponse.data.message);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  async function handleFileUpload(e: React.FormEvent<HTMLInputElement>) {
    try {
      const element = e.currentTarget;
      const file = element.files![0] ?? "";
      const maxSizeInBytes = 15 * 1024 * 1024; // 15MB

      if (file.size > maxSizeInBytes)
        throw new Error(
          "Image size exceeds the maximum allowed size (15MB). Please choose a smaller image."
        );

      const imageBase64 = (await convertToBase64(file)) as string;

      setViewImageToCreate(imageBase64);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <section id={styles.viewsContainer}>
      <div>
        <div id={styles.buttonsSelectContainer}>
          {views ? (
            views.length > 0 ? (
              views.map((view: any, index: number) => {
                return (
                  <button key={index} onClick={() => setEditingView(view)}>
                    {view.name}
                  </button>
                );
              })
            ) : (
              "No views"
            )
          ) : (
            <div className={styles.loaderView}>
              <Image
                src="/icons/loader.gif"
                alt="Loader Icon"
                height="28"
                width="28"
              />
            </div>
          )}
          <button
            onClick={() =>
              toggleModal(ModalAction.OPEN, ModalPurpose.CREATE_VIEW)
            }
          >
            + Create a View
          </button>
        </div>
      </div>
      <div>
        {editingView ? (
          <ElementsBox view={editingView} />
        ) : (
          <p>Select a view for edit it...</p>
        )}
      </div>
      <section
        id={modalStyles.modalContainer}
        className={`${modalStyles.hidden} createModal`}
      >
        <div id={styles.modal}>
          <div>
            <Image
              src="icons/close-main-color.svg"
              alt="Close Icon"
              height="34"
              width="34"
              onClick={() =>
                toggleModal(ModalAction.CLOSE, ModalPurpose.CREATE_VIEW)
              }
            />
          </div>
          <div>
            {viewModalPurpose === ModalPurpose.CREATE_VIEW ? (
              <>
                <h2>Create View:</h2>
                <form onSubmit={handleCreateView}>
                  <label>View Name:</label>
                  <input
                    placeholder="McDonalds View"
                    type="text"
                    name="newViewName"
                    required
                  />
                  <label>View URL:</label>
                  <input
                    placeholder="mc-donalds"
                    type="text"
                    name="newViewUrl"
                    required
                  />
                  {viewImageToCreate ? (
                    <div className={styles.imageUpload}>
                      <div>
                        <Image
                          src={viewImageToCreate}
                          alt="Added Image"
                          width="32"
                          height="32"
                        />
                      </div>
                      <div>
                        <h3>Image Uploaded!</h3>
                        <p>{`Size: ${get64BaseSize(viewImageToCreate)} KB`}</p>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={styles.imageUpload}
                      htmlFor="viewImageUpload"
                    >
                      <div>+</div>
                      <div>
                        <h3>Upload View Image</h3>
                        <input
                          id="viewImageUpload"
                          type="file"
                          name="projectImage"
                          accept=".jpg, .png, .jpeg"
                          onChange={handleFileUpload}
                          required
                        />
                        <p>{"(Format should be jpg/png)"}</p>
                      </div>
                    </label>
                  )}

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
