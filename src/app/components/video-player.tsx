"use client";
import styles from "@/styles/components/video-player.module.sass";
import profileStyles from "@/styles/components/profile-link.module.sass";
import { useEffect, useState } from "react";

export function VideoPlayer({
  text,
  url,
  id,
}: {
  text: string;
  url: string;
  id: number;
}) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const videoContainer = document.querySelectorAll(
      `#${styles.videoContainer}`
    )[id];

    if (showVideo === true) {
      videoContainer.classList.remove(styles.hidden);
    } else {
      videoContainer.classList.add(styles.hidden);
    }
  }, [showVideo]);

  return (
    <>
      <div
        id={profileStyles.profileSection}
        className={styles.videoPlayerSection}
        onClick={() => {
          setShowVideo(!showVideo);
        }}
      >
        <h2>{text}</h2>
      </div>
      <article id={styles.videoContainer} className={styles.hidden}>
        <video id={styles.video} width="300" height="240" controls>
          <source src={url}></source>
        </video>
      </article>
    </>
  );
}
