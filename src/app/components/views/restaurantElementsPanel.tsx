import styles from "@/styles/components/restaurant-elements-panel.module.sass";
import elementStyles from "@/styles/page.module.sass";
import { VideoPlayer } from "./video-player";
import { ModalImage } from "./modal-image";
import { ProfileLink } from "./profile-link";
import Image from "next/image";

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
    <section id={styles.restaurantElementsContainer}>
      <div id={elementStyles.main}>
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
                  return <p key={index}>{element.text}</p>;
                case 2:
                  return (
                    <VideoPlayer
                      key={index}
                      text={element.text ?? "To Add"}
                      url={element.video_link}
                    />
                  );
                case 3:
                  return (
                    <ModalImage
                      key={index}
                      text={element.text ?? "To add"}
                      url={element.image_link}
                    />
                  );
                case 4:
                  return (
                    <ProfileLink
                      key={index}
                      text={element.text ?? "To add"}
                      url={element.button_link}
                    />
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
  );
}
