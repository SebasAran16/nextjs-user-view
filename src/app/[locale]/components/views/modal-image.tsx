"use client";
import styles from "@/styles/components/elements/modal-image.module.sass";
import profileStyles from "@/styles/components/elements/profile-link.module.sass";
import { useState } from "react";
import Image from "next/image";

interface ModalImageProps {
  text: string;
  url: string;
  mainColor: string;
  secondaryColor: string;
  textColor: string;
}

export function ModalImage({
  text,
  url,
  mainColor,
  secondaryColor,
  textColor,
}: ModalImageProps) {
  const [hiddenModal, setHiddenModal] = useState(true);

  return (
    <>
      <div
        id={profileStyles.profileSection}
        style={{
          background: `linear-gradient(90deg, ${secondaryColor} 0%, #3fb982 55%, ${mainColor} 100%)`,
        }}
        onClick={() => {
          setHiddenModal(!hiddenModal);
        }}
      >
        <h2 style={{ color: textColor }}>{text}</h2>
      </div>
      {!hiddenModal ? (
        <article id={styles.modalContainer}>
          <Image
            src="/close.svg"
            alt="Close Icon"
            width="24"
            height="24"
            onClick={() => {
              setHiddenModal(!hiddenModal);
            }}
          />
          <img src={url ?? ""} alt="Display Image" width="320" height="460" />
        </article>
      ) : (
        ""
      )}
    </>
  );
}
