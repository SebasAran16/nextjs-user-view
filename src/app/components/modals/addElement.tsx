import styles from "@/styles/components/modals/element.module.sass";
import imageInputStyles from "@/styles/image-input.module.sass";
import INewElement from "@/types/newElement.interface";
import convertToBase64 from "@/utils/convertToBase64";
import ElementTypes from "@/utils/elementsStruct";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import get64BaseSize from "@/utils/getBase64Size";
import { useRouter } from "next/navigation";

interface AddElementModalProps {
  setVisibleModal: Function;
  setCurrentElements: Function;
  currentElements: any[];
  setAddFormType: Function;
  addFormType: number;
  view: any;
}

export function AddElementModal({
  setVisibleModal,
  view,
  setCurrentElements,
  currentElements,
  setAddFormType,
  addFormType,
}: AddElementModalProps) {
  const router = useRouter();
  const [linkGroupCount, setLinkGroupCount] = useState(0);
  const [linkGroupImages, setLinkGroupImages] = useState<Array<string>>([]);

  const handleAddElementSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const elementName = (
        form.elements.namedItem("addElementName") as HTMLInputElement
      ).value;
      const elementType = parseInt(
        (form.elements.namedItem("addElementType") as HTMLSelectElement).value
      );

      const addElementObject: INewElement = {
        view_id: view._id,
        name: elementName,
        type: elementType,
      };

      if (elementType !== ElementTypes.LINK_GROUP) {
        const elementText = (
          form.elements.namedItem("addElementText") as HTMLInputElement
        ).value;
        addElementObject.text = elementText;
      }

      switch (elementType) {
        case ElementTypes.TEXT:
          break;
        case ElementTypes.VIDEO:
          const elementVideoLink = (
            form.elements.namedItem("addElementVideoLink") as HTMLInputElement
          ).value;
          addElementObject.video_link = elementVideoLink;
          break;
        case ElementTypes.IMAGE:
          const elementImageLink = (
            form.elements.namedItem("addElementImageLink") as HTMLInputElement
          ).value;
          addElementObject.image_link = elementImageLink;
          break;
        case ElementTypes.LINK:
          const elementButtonLink = (
            form.elements.namedItem("addElementButtonLink") as HTMLInputElement
          ).value;
          addElementObject.button_link = elementButtonLink;
          break;
        case ElementTypes.LINK_GROUP:
          const linkGroupValues = [];

          for (let i = 1; i < linkGroupCount + 1; i++) {
            const linkGroupLink = (
              form.elements.namedItem(
                "addElementGroupLink" + i
              ) as HTMLInputElement
            ).value;
            const linkGroupImage = linkGroupImages[i];

            linkGroupValues.push({
              link: linkGroupLink,
              image: linkGroupImage,
            });
          }
          addElementObject.link_group = linkGroupValues;
          break;
        default:
          throw new Error("Element type not valid");
      }

      const addResponse = await axios.post(
        "/api/elements/add",
        addElementObject
      );

      if (addResponse.status !== 200) throw new Error(addResponse.data.message);

      currentElements.push(addResponse.data.element);
      setCurrentElements(currentElements);
      setVisibleModal(false);
      toast.success(addResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue adding the element");
    } finally {
      setAddFormType(undefined);
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

      linkGroupImages.push(imageBase64);
      setLinkGroupImages(linkGroupImages);
      router.refresh();
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  const decreaseLinkGroup = (groupLink: number) => {
    if (linkGroupImages.length === groupLink) {
      linkGroupImages.splice(linkGroupImages.length - 1, 1);
      setLinkGroupImages(linkGroupImages);
    }

    setLinkGroupCount(linkGroupCount - 1);
  };

  return (
    <>
      <h2>Add Element:</h2>
      <form onSubmit={handleAddElementSubmit}>
        <label>Element Name:</label>
        <input
          placeholder="ex Restaurant Menu"
          type="text"
          name="addElementName"
          required
        />
        <label>Element Type:</label>
        <select
          onChange={(e) => {
            const selectedValue = e.target.value;

            if (selectedValue !== "") {
              const addType = parseInt(selectedValue);
              setAddFormType(addType);
              if (addType == ElementTypes.LINK_GROUP) setLinkGroupCount(1);
            }
          }}
          value={addFormType}
          name="addElementType"
          required
        >
          <option value="">Please Choose a Type</option>
          <option value={ElementTypes.TEXT}>Text</option>
          <option value={ElementTypes.VIDEO}>Video</option>
          <option value={ElementTypes.IMAGE}>Image</option>
          <option value={ElementTypes.LINK}>Link Button</option>
          <option value={ElementTypes.LINK_GROUP}>Link Group</option>
        </select>
        {addFormType ? (
          addFormType !== ElementTypes.LINK_GROUP ? (
            <>
              <label>Text:</label>
              <input
                placeholder="New Offer!"
                type="text"
                name="addElementText"
                required
              />
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {addFormType ? (
          addFormType === ElementTypes.TEXT ? (
            ""
          ) : addFormType === ElementTypes.VIDEO ? (
            <>
              <label>Video Link:</label>
              <input
                placeholder="https://youtube.com/sdf..dsfsd"
                type="text"
                name="addElementVideoLink"
              />
            </>
          ) : addFormType === ElementTypes.IMAGE ? (
            <>
              <label>Image Link:</label>
              <input
                placeholder="https://restaurant.com/gallery/1.jpg"
                type="text"
                name="addElementImageLink"
              />
            </>
          ) : addFormType === ElementTypes.LINK ? (
            <>
              <label>Button Link:</label>
              <input
                placeholder="https://restaurant.com/menu"
                type="text"
                name="addElementButtonLink"
              />
            </>
          ) : addFormType === ElementTypes.LINK_GROUP ? (
            <>
              <div className={styles.spaceBetweenContainer}>
                <label>Link 1:</label>
              </div>
              <input
                placeholder="https://restaurant.com/menu"
                type="text"
                name="addElementGroupLink1"
              />
              {linkGroupImages.length > 0 ? (
                <div className={imageInputStyles.uploadedImage}>
                  <div>
                    <Image
                      src={linkGroupImages[0]}
                      alt="Added Image"
                      width="32"
                      height="32"
                    />
                  </div>
                  <div>
                    <h3>Image Uploaded!</h3>
                    <p>{`Size: ${get64BaseSize(linkGroupImages[0])} KB`}</p>
                  </div>
                </div>
              ) : (
                <label
                  className={imageInputStyles.imageUpload}
                  htmlFor="linkGroupImage1"
                >
                  <div>+</div>
                  <div>
                    <h3>Upload Link 1 Image</h3>
                    <input
                      id="linkGroupImage1"
                      type="file"
                      name="addElementGroupLinkImage1"
                      accept=".jpg, .png, .jpeg"
                      onChange={handleFileUpload}
                    />
                    <p>{"(Format should be jpg/png)"}</p>
                  </div>
                </label>
              )}
              {linkGroupCount > 1 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 2:</label>
                    {linkGroupCount === 2 ? (
                      <button onClick={() => decreaseLinkGroup(2)}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink2"
                  />
                  {linkGroupImages.length > 1 ? (
                    <div className={imageInputStyles.uploadedImage}>
                      <div>
                        <Image
                          src={linkGroupImages[1]}
                          alt="Added Image"
                          width="32"
                          height="32"
                        />
                      </div>
                      <div>
                        <h3>Image Uploaded!</h3>
                        <p>{`Size: ${get64BaseSize(linkGroupImages[1])} KB`}</p>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={imageInputStyles.imageUpload}
                      htmlFor="linkGroupImage2"
                    >
                      <div>+</div>
                      <div>
                        <h3>Upload Link 2 Image</h3>
                        <input
                          id="linkGroupImage2"
                          type="file"
                          name="addElementGroupLinkImage2"
                          accept=".jpg, .png, .jpeg"
                          onChange={handleFileUpload}
                        />
                        <p>{"(Format should be jpg/png)"}</p>
                      </div>
                    </label>
                  )}
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 2 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 3:</label>
                    {linkGroupCount === 3 ? (
                      <button onClick={() => decreaseLinkGroup(3)}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink3"
                  />
                  {linkGroupImages.length > 2 ? (
                    <div className={imageInputStyles.uploadedImage}>
                      <div>
                        <Image
                          src={linkGroupImages[2]}
                          alt="Added Image"
                          width="32"
                          height="32"
                        />
                      </div>
                      <div>
                        <h3>Image Uploaded!</h3>
                        <p>{`Size: ${get64BaseSize(linkGroupImages[2])} KB`}</p>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={imageInputStyles.imageUpload}
                      htmlFor="linkGroupImage3"
                    >
                      <div>+</div>
                      <div>
                        <h3>Upload Link 3 Image</h3>
                        <input
                          id="linkGroupImage3"
                          type="file"
                          name="addElementGroupLinkImage3"
                          accept=".jpg, .png, .jpeg"
                          onChange={handleFileUpload}
                        />
                        <p>{"(Format should be jpg/png)"}</p>
                      </div>
                    </label>
                  )}
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 3 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 4:</label>
                    {linkGroupCount === 4 ? (
                      <button onClick={() => decreaseLinkGroup(4)}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink4"
                  />
                  {linkGroupImages.length > 3 ? (
                    <div className={imageInputStyles.uploadedImage}>
                      <div>
                        <Image
                          src={linkGroupImages[3]}
                          alt="Added Image"
                          width="32"
                          height="32"
                        />
                      </div>
                      <div>
                        <h3>Image Uploaded!</h3>
                        <p>{`Size: ${get64BaseSize(linkGroupImages[3])} KB`}</p>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={imageInputStyles.imageUpload}
                      htmlFor="linkGroupImage4"
                    >
                      <div>+</div>
                      <div>
                        <h3>Upload Link 4 Image</h3>
                        <input
                          id="linkGroupImage4"
                          type="file"
                          name="addElementGroupLinkImage4"
                          accept=".jpg, .png, .jpeg"
                          onChange={handleFileUpload}
                        />
                        <p>{"(Format should be jpg/png)"}</p>
                      </div>
                    </label>
                  )}
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 4 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 5:</label>
                    {linkGroupCount === 5 ? (
                      <button onClick={() => decreaseLinkGroup(5)}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink5"
                  />
                  {linkGroupImages.length > 4 ? (
                    <div className={imageInputStyles.uploadedImage}>
                      <div>
                        <Image
                          src={linkGroupImages[4]}
                          alt="Added Image"
                          width="32"
                          height="32"
                        />
                      </div>
                      <div>
                        <h3>Image Uploaded!</h3>
                        <p>{`Size: ${get64BaseSize(linkGroupImages[4])} KB`}</p>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={imageInputStyles.imageUpload}
                      htmlFor="linkGroupImage5"
                    >
                      <div>+</div>
                      <div>
                        <h3>Upload Link 5 Image</h3>
                        <input
                          id="linkGroupImage5"
                          type="file"
                          name="addElementGroupLinkImage5"
                          accept=".jpg, .png, .jpeg"
                          onChange={handleFileUpload}
                        />
                        <p>{"(Format should be jpg/png)"}</p>
                      </div>
                    </label>
                  )}
                </>
              ) : (
                ""
              )}
              <button
                onClick={() => {
                  if (linkGroupCount > 4) {
                    toast.error("Only 5 links can be added");
                    return;
                  }
                  setLinkGroupCount(linkGroupCount + 1);
                }}
                disabled={linkGroupCount > 4}
              >
                + Add Link
              </button>
              {linkGroupCount === 5 ? (
                <p className={styles.discreteText}>Maximum links reached</p>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <button type="submit" disabled={!addFormType}>
          Add Element
        </button>
      </form>
    </>
  );
}
