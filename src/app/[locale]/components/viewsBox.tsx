"use client";
import styles from "@/styles/components/views-box.module.sass";
import { ModalPurpose } from "@/types/structs/modalPurposes.enum";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ElementsBox from "./elementsBox";
import Image from "next/image";
import { Modal } from "./modal";
import { useTranslations } from "use-intl";

interface ViewsBoxProps {
  restaurantId: string;
}

export default function ViewsBox({ restaurantId }: ViewsBoxProps) {
  const t = useTranslations("Dashboard.Components.Restaurants.ViewsBox");

  const [views, setViews] = useState<any | undefined>();
  const [editingView, setEditingView] = useState<any | undefined>();
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    if (!views) {
      axios
        .post("/api/views/search", { restaurant_id: restaurantId })
        .then((viewsResponse) => {
          if (viewsResponse.status !== 200)
            throw new Error(viewsResponse.data.message);

          const views = viewsResponse.data.views;
          setViews(views);
        })
        .catch((err: any) => {
          console.log(err);
          toast.error("Could not get Views");
        });
    }
  }, [views]);

  return (
    <section id={styles.viewsContainer}>
      <div>
        <div id={styles.buttonsSelectContainer}>
          {views ? (
            views.length > 0 ? (
              views.map((view: any, index: number) => {
                return (
                  <button key={index} onClick={() => setEditingView(view)}>
                    {view.name}
                  </button>
                );
              })
            ) : (
              ""
            )
          ) : (
            <div className={styles.loaderView}>
              <Image
                src="/icons/loader.gif"
                alt="Loader Icon"
                height="28"
                width="28"
              />
            </div>
          )}
          <button onClick={() => setVisibleModal(true)}>+ {t("create")}</button>
        </div>
      </div>
      <div>
        {editingView ? (
          <ElementsBox
            view={editingView}
            setEditingView={setEditingView}
            setViews={setViews}
            views={views}
          />
        ) : (
          <p>{t("selectText")}</p>
        )}
      </div>
      <Modal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        modalPurpose={ModalPurpose.CREATE_VIEW}
        pastObjects={views}
        setObjects={setViews}
        restaurantId={restaurantId}
        setEditingView={setEditingView}
      />
    </section>
  );
}
