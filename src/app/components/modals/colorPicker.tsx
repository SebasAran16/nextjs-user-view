import styles from "@/styles/components/color-selector.module.sass";
import { ColorUse } from "@/types/structs/colorUse";
import axios from "axios";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-hot-toast";

interface ColorPickerInterface {
  color: string;
  setColor: any;
  setVisibleModal: Function;
  view: any;
  keyToChange: ColorUse;
}

export function ColorPicker({
  color,
  setColor,
  setVisibleModal,
  view,
  keyToChange,
}: ColorPickerInterface) {
  const [initialColor] = useState(color);
  const [hexColor, setHexColor] = useState<string>("");

  async function handleSaveColor() {
    try {
      axios
        .post("/api/views/edit", {
          id: view._id,
          [keyToChange + "_color"]: color,
        })
        .then((colorChangeResponse) => {
          if (colorChangeResponse.status !== 200)
            throw new Error(colorChangeResponse.data.message);

          setVisibleModal(false);
          toast.success("Color changed successfully!");
        });
    } catch (err) {
      console.log(err);
      toast.error("There was an error changing the color");
    }
  }

  async function handleHexSaveColor(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const hexRegex = /^#([0-9a-f]{3}){1,2}$/i;

      if (!hexRegex.test(hexColor)) {
        toast.error("Value set is not HEX");
        return;
      }

      e.currentTarget.reset();
      setHexColor("");
      setColor(hexColor);
    } catch (err) {
      console.log(err);
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
      <div>
        <HexColorPicker color={color} onChange={setColor} />
      </div>
      <form onSubmit={handleHexSaveColor}>
        <label>Set in HEX:</label>
        <div>
          <input
            type="text"
            name="colorHex"
            placeholder="#000000"
            minLength={7}
            maxLength={7}
            onChange={(e) => setHexColor(e.currentTarget.value)}
          />
          <button
            type="submit"
            disabled={hexColor === "" || hexColor.length !== 7}
          >
            Set
          </button>
        </div>
      </form>
      <div>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleSaveColor}>Save Color</button>
      </div>
    </div>
  );
}
