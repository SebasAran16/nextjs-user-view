import styles from "@/styles/components/restaurant-elements-panel.module.sass";
import Image from "next/image";
import { RestaurantElementEditor } from "../restaurantElementEditor";
import { ColorSelector } from "../colorSelector";
import { ColorUse } from "@/types/structs/colorUse";

interface RestaurantElementsPanelProps {
  elements: any[];
  setCurrentElements: Function;
  view: any;
}

export function RestaurantElementsPanel({
  elements,
  setCurrentElements,
  view,
}: RestaurantElementsPanelProps) {
  return (
    <>
      <div id={styles.colorSelectorsContainer}>
        <ColorSelector
          existentColor={view.main_color}
          keyToChange={ColorUse.MAIN}
          view={view}
        />
        <ColorSelector
          existentColor={view.secondary_color}
          keyToChange={ColorUse.SECONDARY}
          view={view}
        />
        <ColorSelector
          existentColor={view.text_color}
          keyToChange={ColorUse.TEXT}
          view={view}
        />
      </div>
      <h3>This is what your customers see in your View:</h3>
      <section id={styles.restaurantPanelContainer}>
        <p>-Select element to edit</p>

        <div id={styles.elementsContainer}>
          <Image
            id={styles.logo}
            src={view.image}
            alt="Logo Image"
            width="100"
            height="100"
          />

          {elements ? (
            elements.length > 0 ? (
              elements.map((element: any, index: number) => {
                const elementType = element.type;

                switch (elementType) {
                  case 1:
                    return (
                      <RestaurantElementEditor
                        key={index}
                        element={element}
                        setCurrentElements={setCurrentElements}
                        elements={elements}
                      >
                        <p key={index}>{element.text}</p>
                      </RestaurantElementEditor>
                    );
                  case 2:
                  case 3:
                  case 4:
                    return (
                      <RestaurantElementEditor
                        key={index}
                        element={element}
                        elements={elements}
                        setCurrentElements={setCurrentElements}
                      >
                        <div id={styles.elementSection}>
                          <h2>{element.text}</h2>{" "}
                        </div>
                      </RestaurantElementEditor>
                    );
                  default:
                    console.log("Could not show element:", element);
                    return null; // Return null or handle the default case
                }
              })
            ) : (
              <div /*id={styles.defaultViewNoElements}*/>
                <p>Elements added will show here...</p>
              </div>
            )
          ) : (
            <Image
              src="/icons/loader.gif"
              alt="Loader Icon"
              height="28"
              width="28"
            />
          )}
        </div>
      </section>
    </>
  );
}
