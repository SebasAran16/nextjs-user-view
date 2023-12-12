import styles from "@/styles/components/element-data.module.sass";
import { formatElementValue } from "@/utils/formatElementValue";
import { fromSerpentToReadable } from "@/utils/fromSerpentToReadable";

interface CurrentElementInterface {
  element: any;
}

const notToInclude = ["_id", "__v", "view_id"];

export default function CurrentElementData({
  element,
}: CurrentElementInterface) {
  return (
    <section id={styles.dataContainer}>
      {Object.entries(element).map(([key, value]) => {
        if (!notToInclude.includes(key))
          return (
            <div>
              <h3>{fromSerpentToReadable(key) + ":"}</h3>
              <p>{formatElementValue(key, value)}</p>
            </div>
          );
      })}
    </section>
  );
}
