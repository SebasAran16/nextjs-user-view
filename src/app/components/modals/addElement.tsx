import styles from "@/styles/components/modals/element.module.sass";
import INewElement from "@/types/newElement.interface";
import axios from "axios";
import toast from "react-hot-toast";

interface AddElementModalProps {
  setVisibleModal: Function;
  setUpdateElements: Function;
  setAddFormType: Function;
  addFormType: number;
  view: any;
}

export function AddElementModal({
  setVisibleModal,
  view,
  setUpdateElements,
  setAddFormType,
  addFormType,
}: AddElementModalProps) {
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
      const elementText = (
        form.elements.namedItem("addElementText") as HTMLInputElement
      ).value;

      const addElementObject: INewElement = {
        view_id: view._id,
        name: elementName,
        type: elementType,
        text: elementText,
      };

      switch (elementType) {
        case 1:
          break;
        case 2:
          const elementVideoLink = (
            form.elements.namedItem("addElementVideoLink") as HTMLInputElement
          ).value;
          addElementObject.video_link = elementVideoLink;
          break;
        case 3:
          const elementImageLink = (
            form.elements.namedItem("addElementImageLink") as HTMLInputElement
          ).value;
          addElementObject.image_link = elementImageLink;
          break;
        case 4:
          const elementButtonLink = (
            form.elements.namedItem("addElementButtonLink") as HTMLInputElement
          ).value;
          addElementObject.button_link = elementButtonLink;
          break;
        case 5:
        // TODO
        default:
          throw new Error("Element type not valid");
      }

      const addResponse = await axios.post(
        "/api/elements/add",
        addElementObject
      );

      if (addResponse.status !== 200) throw new Error(addResponse.data.message);

      setUpdateElements(true);
      setVisibleModal(false);
      toast.success(addResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an issue adding the element");
    }
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

            if (selectedValue !== "") setAddFormType(parseInt(selectedValue));
          }}
          value={addFormType}
          name="addElementType"
          required
        >
          <option value="">Please Choose a Type</option>
          <option value="1">Text</option>
          <option value="2">Video</option>
          <option value="3">Image</option>
          <option value="4">Link Button</option>
          {/* TODO Add link button component */}
        </select>
        <label>Text:</label>
        <input
          placeholder="New Offer!"
          type="text"
          name="addElementText"
          required
        />
        {addFormType ? (
          addFormType === 1 ? (
            ""
          ) : addFormType === 2 ? (
            <>
              <label>Video Link:</label>
              <input
                placeholder="https://youtube.com/sdf..dsfsd"
                type="text"
                name="addElementVideoLink"
              />
            </>
          ) : addFormType === 3 ? (
            <>
              <label>Image Link:</label>
              <input
                placeholder="https://restaurant.com/gallery/1.jpg"
                type="text"
                name="addElementImageLink"
              />
            </>
          ) : addFormType === 4 ? (
            <>
              <label>Button Link:</label>
              <input
                placeholder="https://restaurant.com/menu"
                type="text"
                name="addElementButtonLink"
              />
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
