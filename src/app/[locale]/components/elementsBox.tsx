"use client";
import styles from "@/styles/components/elements-box.module.sass";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import getSortedElements from "@/utils/getSortedElements";
import Image from "next/image";
import { ConfirmationModal } from "./confirmationModal";
import { Object } from "@/types/structs/object.enum";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/utils/globalStates";
import { UserRol } from "@/types/structs/userRol.enum";
import { AdminElementsPanel } from "./adminElementsPanel";
import { RestaurantElementsPanel } from "./restaurantElementsPanel";
import { useTranslations } from "next-intl";

interface ElementsBoxProps {
  view: any;
  views: any[];
  setViews: Function;
  setEditingView: Function;
}

export default function ElementsBox({
  view,
  setEditingView,
  views,
  setViews,
}: ElementsBoxProps) {
  const t = useTranslations("Dashboard.Components.Restaurants.ElementsBox");
  const router = useRouter();

  const [userData] = useGlobalState("userData");
  const [currentElements, setCurrentElements] = useState<any | undefined>();
  const [elementToRemove, setElementToRemove] = useState<any | undefined>();
  const [visibleConfirmation, setVisibleConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<
    undefined | Object
  >();

  useEffect(() => {
    try {
      if (!currentElements) {
        axios
          .post("/api/elements/get-for-view", {
            view_id: view._id,
          })
          .then((elementsResponse) => {
            if (elementsResponse.status !== 200)
              throw new Error(elementsResponse.data.message);

            const elements = elementsResponse.data.elements;

            setCurrentElements(getSortedElements(elements));
          })
          .catch((err) => {
            console.log(err);
            if (axios.isAxiosError(err)) toast.error(err.message);
          });
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) toast.error(err.message);
    }
  }, [view]);

  return (
    <>
      <Toaster />
      <section id={styles.elementsBox}>
        <Image src={view.image} alt="View Image" width="64" height="64" />
        <button
          onClick={() => {
            setConfirmationType(Object.VIEW);
            setElementToRemove(view);
            setVisibleConfirmation(true);
          }}
        >
          {t("eliminateView")}
        </button>
        <p>
          {t("visibility")}
          <a
            href={`https://customerview.app/view/${view.url}`}
            target="_blank"
          >{`https://customerview.app/view/${view.url}`}</a>
        </p>
        <div id={styles.headerSection}>
          <h2>{t("title")}</h2>
        </div>
        <hr />
        <div id={styles.elementsContainer}>
          {userData ? (
            userData.rol === UserRol.ADMIN ? (
              <AdminElementsPanel
                elements={currentElements}
                setCurrentElements={setCurrentElements}
                view={view}
              />
            ) : (
              <>
                <RestaurantElementsPanel
                  elements={currentElements}
                  setCurrentElements={setCurrentElements}
                  view={view}
                  setEditingView={setEditingView}
                />
              </>
            )
          ) : (
            t("fallbackMessage")
          )}
        </div>
      </section>
      <ConfirmationModal
        object={elementToRemove}
        objectType={Object.VIEW}
        pastObjects={views}
        setObjects={setViews}
        visibleConfirmation={visibleConfirmation}
        setVisibleConfirmation={setVisibleConfirmation}
        setEditingView={setEditingView}
      />
    </>
  );
}
