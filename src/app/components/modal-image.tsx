"use client";
import styles from "@/styles/components/modal-image.module.sass";
import profileStyles from "@/styles/components/profile-link.module.sass";
import { useState } from "react";
import Image from "next/image";
import { MediaComponentProps } from "@/types/mediaComponentProps.interface";

export function ModalImage({ text, url }: MediaComponentProps) {
  const [hiddenModal, setHiddenModal] = useState(true);

  return (
    <>
      <div
        id={profileStyles.profileSection}
        onClick={() => {
          setHiddenModal(!hiddenModal);
        }}
      >
        <h2>{text}</h2>
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
          <Image src={url ?? ""} alt="Display Image" width="320" height="460" />
        </article>
      ) : (
        ""
      )}
    </>
  );
}
