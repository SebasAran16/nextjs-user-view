"use client";
import styles from "@/styles/view.module.sass";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import getSortedElements from "@/utils/getSortedElements";
import Image from "next/image";
import { VideoPlayer } from "@/app/components/video-player";
import { ModalImage } from "@/app/components/modal-image";
import { ProfileLink } from "@/app/components/profile-link";

interface viewPageProps {
  params: { view_url: string };
}

export default function ViewPage({ params }: viewPageProps) {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<any | undefined>();
  const [viewElements, setViewElements] = useState<any | undefined>();
  const [currentElementId, setCurrentElementId] = useState(0);

  useEffect(() => {
    axios
      .post("/api/view-elements/get-for-url", {
        url: params.view_url,
      })
      .then((elementsResponse) => {
        if (elementsResponse.status !== 200)
          throw new Error(elementsResponse.data.message);

        const view = elementsResponse.data.view;
        const elements = elementsResponse.data.elements;

        setView(view);
        setViewElements(getSortedElements(elements));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not get elements for View");
      });
  }, []);
  return (
    <main>
      <Toaster />
      {!loading ? (
        <section id={styles.main}>
          <Image
            id={styles.logo}
            src={view.image}
            alt="Logo Image"
            width="200"
            height="200"
          />
          {viewElements.map((element: any, index: number) => {
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
                return;
            }
          })}
        </section>
      ) : (
        "Loading..."
      )}
    </main>
  );
}
