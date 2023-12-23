"use client";
import styles from "@/styles/components/elements/video-player.module.sass";
import profileStyles from "@/styles/components/elements/profile-link.module.sass";
import { useState } from "react";

interface VideoPlayerProps {
  text: string;
  url: string;
  mainColor: string;
  secondaryColor: string;
  textColor: string;
}

export function VideoPlayer({
  text,
  url,
  mainColor,
  secondaryColor,
  textColor,
}: VideoPlayerProps) {
  const [hiddenVideo, setHiddenVideo] = useState(true);

  return (
    <>
      <div
        id={profileStyles.profileSection}
        className={styles.videoPlayerSection}
        style={{
          background: `linear-gradient(90deg, ${secondaryColor} 0%, #3fb982 55%, ${mainColor} 100%)`,
        }}
        onClick={() => {
          setHiddenVideo(!hiddenVideo);
        }}
      >
        <h2 style={{ color: textColor }}>{text}</h2>
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
