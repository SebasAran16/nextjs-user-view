"use client";
import styles from "@/styles/components/video-player.module.sass";
import profileStyles from "@/styles/components/profile-link.module.sass";
import { useState } from "react";
import { MediaComponentProps } from "@/types/mediaComponentProps.interface";

export function VideoPlayer({ text, url }: MediaComponentProps) {
  const [hiddenVideo, setHiddenVideo] = useState(true);

  return (
    <>
      <div
        id={profileStyles.profileSection}
        className={styles.videoPlayerSection}
        onClick={() => {
          setHiddenVideo(!hiddenVideo);
        }}
      >
        <h2>{text}</h2>
      </div>
      {!hiddenVideo ? (
        <article id={styles.videoContainer}>
          <video id={styles.video} width="300" height="240" controls>
            <source src={url}></source>
          </video>
        </article>
      ) : (
        ""
      )}
    </>
  );
}
