import styles from "@/styles/components/color-selector.module.sass";
import { ColorUse } from "@/types/structs/colorUse";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "./modal";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";

interface ColorSelectorProps {
  existentColor: any;
  keyToChange: ColorUse;
  view: any;
}

export function ColorSelector({
  existentColor,
  keyToChange,
  view,
}: ColorSelectorProps) {
  const [color, setColor] = useState(existentColor ?? "#000000");
  const [editColor, setEditColor] = useState(false);

  return (
    <div id={styles.colorSelector}>
      <h3>{capitalizeFirstLetter(keyToChange) + " Color:"}</h3>
      <div
        className={styles.colorShow}
        style={{ backgroundColor: color }}
      ></div>
      {color.hex !== "#000000" ? <p>Current Color</p> : <p>Default Color</p>}
      {!editColor ? (
        <button onClick={() => setEditColor(true)}>Edit</button>
      ) : (
        ""
      )}
      {editColor ? (
        <section>
          <Modal
            visibleModal={editColor}
            setVisibleModal={setEditColor}
            modalPurpose={ModalPurpose.COLOR}
            object={color}
            setObjects={setColor}
            view={view}
            keyToChange={keyToChange}
          />
        </section>
      ) : (
        ""
      )}
    </div>
  );
}
