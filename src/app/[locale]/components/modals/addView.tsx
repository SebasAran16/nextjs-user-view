import styles from "@/styles/components/modals/view.module.sass";
import Image from "next/image";
import convertToBase64 from "@/utils/convertToBase64";
import get64BaseSize from "@/utils/getBase64Size";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

interface AddViewProps {
  setVisibleModal: Function;
  setViews: Function;
  views: any[];
  restaurantId: string;
  setEditingView: Function;
}

export function AddViewModal({
  setViews,
  setVisibleModal,
  restaurantId,
  setEditingView,
  views,
}: AddViewProps) {
  const [viewImageToCreate, setViewImageToCreate] = useState<
    string | undefined
  >();

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

      const createViewResponse = await axios.post("/api/views/add", {
        restaurant_id: restaurantId,
        name: newViewName,
        url: newViewUrl,
        image: viewImageToCreate,
      });

      if (createViewResponse.status !== 200)
        throw new Error(createViewResponse.data.message);

      const newView = createViewResponse.data.view;

      console.log([...views, newView]);
      setEditingView(newView);
      setVisibleModal(false);
      setViews([...views, newView]);
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
          <label className={styles.imageUpload} htmlFor="viewImageUpload">
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
  );
}
