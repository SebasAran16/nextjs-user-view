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
        if (!notToInclude.includes(key)) {
          if (key !== "link_group") {
            return (
              <div key={key}>
                <h3>{fromSerpentToReadable(key) + ":"}</h3>
                <p>{formatElementValue(key, value)}</p>
              </div>
            );
          } else {
            const linkGroup = value as any[];
            return (
              <div key={key}>
                <h3>{fromSerpentToReadable(key) + ":"}</h3>
                <div className={styles.groupLink}>
                  {linkGroup.map((group: any, index: number) => {
                    const clientIndex = index + 1;
                    const { link } = group;
                    return (
                      <div key={index}>
                        <span>{`Link ${clientIndex}:`}</span>
                        <p>{link}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        }
      })}
    </section>
  );
}
