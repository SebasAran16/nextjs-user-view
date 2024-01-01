"use client";
import styles from "@/styles/view.module.sass";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import getSortedElements from "@/utils/getSortedElements";
import Image from "next/image";
import { VideoPlayer } from "@/app/[locale]/components/views/video-player";
import { ModalImage } from "@/app/[locale]/components/views/modal-image";
import { ProfileLink } from "@/app/[locale]/components/views/profile-link";
import { getColorFromUse } from "@/utils/returnUseColor";
import { ColorUse } from "@/types/structs/colorUse";
import { TextElement } from "@/app/[locale]//components/views/text-element";
import { LinkGroup } from "@/app/[locale]//components/views/link-group";
import { useLocale } from "next-intl";
import { getTextLanguage } from "@/utils/getTextLanguageCode";
import ISO6391 from "iso-639-1";
import { getElementTextTranslated } from "@/utils/getElementTextTranslated";
import { locales } from "@/utils/arrays/locales";
import { useRouter } from "next/navigation";

interface viewPageProps {
  params: { view_url: string };
}

export default function ViewPage({ params }: viewPageProps) {
  const userLocale = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<any | undefined>();
  const [viewElements, setViewElements] = useState<any | undefined>();
  const [mainColor, setMainColor] = useState(getColorFromUse(ColorUse.MAIN));
  const [secondaryColor, setSecondaryColor] = useState(
    getColorFromUse(ColorUse.SECONDARY)
  );
  const [textColor, setTextColor] = useState(getColorFromUse(ColorUse.TEXT));

  useEffect(() => {
    axios
      .post("/api/elements/get-for-url", {
        url: params.view_url,
      })
      .then((elementsResponse) => {
        if (elementsResponse.status !== 200)
          throw new Error(elementsResponse.data.message);

        const view = elementsResponse.data.view;
        const elements = elementsResponse.data.elements;

        const promises = elements.map((element: any) => {
          const elementText = element.text;
          let textLanguageCode;

          if (elementText) {
            textLanguageCode = ISO6391.getCode(getTextLanguage(elementText));
          }

          return getElementTextTranslated(
            elementText,
            textLanguageCode!,
            userLocale
          )
            .then((translation) => {
              if (element.text) {
                element.text = translation;
              }
              return element;
            })
            .catch((err) => console.log(err));
        });

        return Promise.all(promises)
          .then((translatedElements) => {
            setView(view);
            setMainColor(view.main_color ?? mainColor);
            setSecondaryColor(view.secondary_color ?? secondaryColor);
            setTextColor(view.text_color ?? textColor);
            setViewElements(getSortedElements(translatedElements));
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Could not get elements for View");
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not get elements for View");
      });
  }, []);

  const handleLanguageChange = async (locale: string) => {
    try {
      const changeLocaleResponse = await axios.post("/api/changeLocale", {
        locale,
      });

      if (changeLocaleResponse.status !== 200)
        throw new Error(changeLocaleResponse.data.message);

      router.replace("/view/" + params.view_url);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("There was some issue changing the language...");
    }
  };

  return (
    <main>
      <Toaster />
      {!loading ? (
        <section
          id={styles.main}
          style={{ color: view.text_color ?? getColorFromUse(ColorUse.TEXT) }}
        >
          <div id={styles.languageSelector}>
            {locales.map((locale: string, index: number) => {
              return (
                <button
                  key={index}
                  onClick={() => handleLanguageChange(locale)}
                >
                  {ISO6391.getName(locale === "cat" ? "ca" : locale)}
                </button>
              );
            })}
          </div>
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
                return (
                  <TextElement
                    key={index}
                    text={element.text}
                    mainColor={mainColor}
                    textColor={textColor}
                  />
                );
              case 2:
                return (
                  <VideoPlayer
                    key={index}
                    text={element.text ?? "To Add"}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
                    textColor={textColor}
                    url={element.video_link}
                  />
                );
              case 3:
                return (
                  <ModalImage
                    key={index}
                    text={element.text ?? "To add"}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
                    textColor={textColor}
                    url={element.image_link}
                  />
                );
              case 4:
                return (
                  <ProfileLink
                    key={index}
                    text={element.text ?? "To add"}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
                    textColor={textColor}
                    url={element.button_link}
                  />
                );
              case 5:
                return (
                  <LinkGroup
                    key={index}
                    groups={element.link_group}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
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
