import styles from "@/styles/components/color-selector.module.sass";
import { ColorUse } from "@/types/structs/colorUse";
import axios from "axios";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ColorPickerInterface {
  color: string;
  setColor: any;
  setVisibleModal: Function;
  view: any;
  colorUse: ColorUse;
  setEditingView: Function;
}

export function ColorPicker({
  color,
  setColor,
  setVisibleModal,
  view,
  colorUse,
  setEditingView,
}: ColorPickerInterface) {
  const router = useRouter();
  const [initialColor] = useState(color);
  const [hexColor, setHexColor] = useState<string>("");

  const hexRegex = /^#([0-9a-f]{3}){1,2}$/i;

  async function handleSaveColor() {
    try {
      axios
        .post("/api/views/edit", {
          id: view._id,
          [colorUse + "_color"]: color,
        })
        .then((colorChangeResponse) => {
          if (colorChangeResponse.status !== 200)
            throw new Error(colorChangeResponse.data.message);

          view[colorUse + "_color"] = color;
          setEditingView(view);
          setVisibleModal(false);
          router.refresh();
          toast.success("Color changed successfully!");
        });
    } catch (err) {
      console.log(err);
      toast.error("There was an error changing the color");
    }
  }

  function handleCancel() {
    setColor(initialColor);
    setVisibleModal(false);
  }

  return (
    <div id={styles.modalSection}>
      <div>
        <h3>Color Picked:</h3>
        <div
          className={styles.colorShow}
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div className={styles.colorPickerContainer}>
        <HexColorPicker color={color} onChange={setColor} />
      </div>
      <form>
        <label>Set in HEX:</label>
        <div>
          <input
            type="text"
            name="colorHex"
            placeholder="#000000"
            value={color}
            minLength={7}
            maxLength={7}
            onChange={(e) => setColor(e.currentTarget.value)}
          />
        </div>
      </form>
      <div>
        <button onClick={handleCancel}>Cancel</button>
        <button
          onClick={handleSaveColor}
          disabled={color === initialColor || !hexRegex.test(color)}
        >
          Save Color
        </button>
      </div>
    </div>
  );
}
