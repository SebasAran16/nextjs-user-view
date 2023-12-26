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
import { LinkGroupImageType } from "@/types/structs/linkGroupImageType";

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
  const [linkGroupImages, setLinkGroupImages] = useState<Array<number>>([]);

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
            const linkGroupLinkImageType = (
              form.elements.namedItem(
                "linkGroupImageType" + i
              ) as HTMLInputElement
            ).value;

            if (!linkGroupLinkImageType) {
              toast.error("Set image type for link " + i);
              return;
            }

            linkGroupValues.push({
              link: linkGroupLink,
              image: linkGroupLinkImageType,
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

  const decreaseLinkGroup = () => {
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
              <select name="linkGroupImageType1">
                <option value="">Select Link 1 Image</option>
                <option value={LinkGroupImageType.FACEBOOK}>Facebook</option>
                <option value={LinkGroupImageType.INSTAGRAM}>Instagram</option>
                <option value={LinkGroupImageType.LINKEDIN}>Linkedin</option>
                <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                <option value={LinkGroupImageType.X}>X</option>
                <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                <option value={LinkGroupImageType.WEBSITE}>Website</option>
                <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
              </select>
              {linkGroupCount > 1 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 2:</label>
                    {linkGroupCount === 2 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink2"
                  />
                  <select name="linkGroupImageType2">
                    <option value="">Select Link 2 Image</option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 2 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 3:</label>
                    {linkGroupCount === 3 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink3"
                  />
                  <select name="linkGroupImageType3">
                    <option value="">Select Link 3 Image</option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 3 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 4:</label>
                    {linkGroupCount === 4 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink4"
                  />
                  <select name="linkGroupImageType4">
                    <option value="">Select Link 4 Image</option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              {linkGroupCount > 4 ? (
                <>
                  <div className={styles.spaceBetweenContainer}>
                    <label>Link 5:</label>
                    {linkGroupCount === 5 ? (
                      <button onClick={() => decreaseLinkGroup()}>-</button>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    placeholder="https://restaurant.com/menu"
                    type="text"
                    name="addElementGroupLink5"
                  />
                  <select name="linkGroupImageType5">
                    <option value="">Select Link 5 Image</option>
                    <option value={LinkGroupImageType.FACEBOOK}>
                      Facebook
                    </option>
                    <option value={LinkGroupImageType.INSTAGRAM}>
                      Instagram
                    </option>
                    <option value={LinkGroupImageType.LINKEDIN}>
                      Linkedin
                    </option>
                    <option value={LinkGroupImageType.TIK_TOK}>Tik Tok</option>
                    <option value={LinkGroupImageType.X}>X</option>
                    <option value={LinkGroupImageType.YOUTUBE}>YouTube</option>
                    <option value={LinkGroupImageType.WEBSITE}>Website</option>
                    <option value={LinkGroupImageType.HASHTAG}>Hashtag</option>
                  </select>
                </>
              ) : (
                ""
              )}
              <button
                type="button"
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
