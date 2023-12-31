import styles from "@/styles/components/color-selector.module.sass";
import { ColorUse } from "@/types/structs/colorUse";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useState } from "react";
import { Modal } from "./modal";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";
import { getColorFromUse } from "@/utils/returnUseColor";
import { useTranslations } from "next-intl";
interface ColorSelectorProps {
  existentColor: any;
  colorUse: ColorUse;
  view: any;
  setEditingView: Function;
}

export function ColorSelector({
  existentColor,
  colorUse,
  view,
  setEditingView,
}: ColorSelectorProps) {
  const t = useTranslations(
    "Dashboard.Components.Restaurants.ElementsBox.RestaurantElementsPanel.ColorSelector"
  );

  const [color, setColor] = useState(
    existentColor ?? getColorFromUse(colorUse)
  );
  const [editColor, setEditColor] = useState(false);

  return (
    <div id={styles.colorSelector}>
      <h3>{capitalizeFirstLetter(colorUse) + " Color:"}</h3>
      <div
        className={styles.colorShow}
        style={{ backgroundColor: color }}
      ></div>
      {!editColor ? (
        <button onClick={() => setEditColor(true)}>{t("edit")}</button>
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
            colorUse={colorUse}
            setEditingView={setEditingView}
          />
        </section>
      ) : (
        ""
      )}
    </div>
  );
}
