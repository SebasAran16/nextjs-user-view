"use client";
import styles from "@/styles/components/modal-image.module.sass";
import profileStyles from "@/styles/components/profile-link.module.sass";
import { useEffect, useState } from "react";
import Image from "next/image";

export function ModalImage({
  text,
  url,
  id,
}: {
  text: string;
  url: string;
  id: number;
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const modalContainer = document.querySelectorAll(
      `#${styles.modalContainer}`
    )[id];

    if (showModal === true) {
      modalContainer.classList.remove(styles.hidden);
    } else {
      modalContainer.classList.add(styles.hidden);
    }
  }, [showModal]);

  return (
    <>
      <div
        id={profileStyles.profileSection}
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        <h2>{text}</h2>
      </div>
      <article id={styles.modalContainer} className={styles.hidden}>
        <Image
          src="/close.svg"
          alt="Close Icon"
          width="24"
          height="24"
          onClick={() => {
            setShowModal(!showModal);
          }}
        />
        <Image src={url ?? ""} alt="Display Image" width="320" height="460" />
      </article>
    </>
  );
}
