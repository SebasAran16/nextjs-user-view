import styles from "@/styles/components/restaurant-elements-panel.module.sass";
import Image from "next/image";
import { RestaurantElementEditor } from "./restaurantElementEditor";
import { ColorSelector } from "./colorSelector";
import { ColorUse } from "@/types/structs/colorUse";
import { hexToRGBA } from "@/utils/hexToRgba";
import ElementTypes from "@/utils/elementsStruct";
import { getImageForLinkGroupImageType } from "@/utils/getImageForLinkGroupImageType";

interface RestaurantElementsPanelProps {
  elements: any[];
  setCurrentElements: Function;
  view: any;
  setEditingView: Function;
}

export function RestaurantElementsPanel({
  elements,
  setCurrentElements,
  view,
  setEditingView,
}: RestaurantElementsPanelProps) {
  return (
    <>
      <div id={styles.colorSelectorsContainer}>
        <ColorSelector
          existentColor={view.main_color}
          colorUse={ColorUse.MAIN}
          view={view}
          setEditingView={setEditingView}
        />
        <ColorSelector
          existentColor={view.secondary_color}
          colorUse={ColorUse.SECONDARY}
          view={view}
          setEditingView={setEditingView}
        />
        <ColorSelector
          existentColor={view.text_color}
          colorUse={ColorUse.TEXT}
          view={view}
          setEditingView={setEditingView}
        />
      </div>
      <h3>This is what your customers see in your View:</h3>
      <section id={styles.restaurantPanelContainer}>
        {elements ? (
          elements.length > 0 ? (
            <p>Select element to edit</p>
          ) : (
            ""
          )
        ) : (
          ""
        )}
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
                  case ElementTypes.TEXT:
                    return (
                      <RestaurantElementEditor
                        key={index}
                        element={element}
                        setCurrentElements={setCurrentElements}
                        elements={elements}
                      >
                        <div
                          id={styles.textElement}
                          style={{
                            border: `2px solid ${view.main_color}`,
                            backgroundColor: hexToRGBA(view.main_color, "0.25"),
                          }}
                        >
                          <h2 style={{ color: view.text_color }}>
                            {element.text}
                          </h2>
                        </div>
                      </RestaurantElementEditor>
                    );
                  case ElementTypes.VIDEO:
                  case ElementTypes.IMAGE:
                  case ElementTypes.LINK:
                    return (
                      <RestaurantElementEditor
                        key={index}
                        element={element}
                        elements={elements}
                        setCurrentElements={setCurrentElements}
                      >
                        <div
                          id={styles.elementSection}
                          style={{
                            background: `linear-gradient(90deg, ${view.secondary_color} 0%, #3fb982 55%, ${view.main_color} 100%)`,
                          }}
                        >
                          <h2 style={{ color: view.text_color }}>
                            {element.text}
                          </h2>{" "}
                        </div>
                      </RestaurantElementEditor>
                    );
                  case ElementTypes.LINK_GROUP:
                    return (
                      <RestaurantElementEditor
                        key={index}
                        element={element}
                        elements={elements}
                        setCurrentElements={setCurrentElements}
                      >
                        <div
                          id={styles.elementSection}
                          style={{
                            background: `linear-gradient(90deg, ${view.secondary_color} 0%, #3fb982 55%, ${view.main_color} 100%)`,
                            color: view.text_color,
                          }}
                        >
                          {element.link_group.map(
                            (group: any, index: number) => {
                              return (
                                <Image
                                  key={index}
                                  src={
                                    getImageForLinkGroupImageType(
                                      parseInt(group.image)
                                    ) ?? ""
                                  }
                                  alt="Link Type Image"
                                  height="50"
                                  width="50"
                                />
                              );
                            }
                          )}
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
                <p>No elements added yet...</p>
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
