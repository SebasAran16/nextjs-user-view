"use client";
import styles from "@/styles/components/elements/profile-link.module.sass";
import Link from "next/link";
import Image from "next/image";

interface ProfileLinkInterface {
  text: string;
  url: string;
  mainColor: string;
  secondaryColor: string;
  textColor: string;
}

export function ProfileLink({
  text,
  url,
  mainColor,
  secondaryColor,
  textColor,
}: ProfileLinkInterface) {
  return (
    <>
      <Link
        id={styles.profileSection}
        style={{
          background: `linear-gradient(90deg, ${secondaryColor} 0%, #3fb982 55%, ${mainColor} 100%)`,
        }}
        href={url}
        target="_blank"
      >
        <h2 style={{ color: textColor }}>{text}</h2>{" "}
      </Link>
    </>
  );
}
