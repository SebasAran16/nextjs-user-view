"use client";
import styles from "@/styles/components/profile-link.module.sass";
import Link from "next/link";
import Image from "next/image";

export async function ProfileLink({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  return (
    <>
      {text !== "" ? (
        <Link id={styles.profileSection} href={url} target="_blank">
          <h2>{text}</h2>{" "}
        </Link>
      ) : (
        <div id={styles.profileSection} className={styles.socialMediaSection}>
          <Link href="https://www.instagram.com/canestruc/" target="_blank">
            <Image
              className={styles.experienceToolImage}
              src="/social-media/instagram.svg"
              alt="Instagram Icon"
              width="50"
              height="50"
            />
          </Link>
          <Link href="https://www.canestruc.com/" target="_blank">
            <Image
              className={styles.experienceToolImage}
              src="/social-media/website.svg"
              alt="Website Icon"
              width="50"
              height="50"
            />
          </Link>
          <Link
            href="https://maps.app.goo.gl/NNaEXePNLfcjC4XC8"
            target="_blank"
          >
            <Image
              className={styles.experienceToolImage}
              src="/social-media/location.svg"
              alt="Location Icon"
              width="50"
              height="50"
            />
          </Link>
          <Link href="https://www.facebook.com/canestruc/" target="_blank">
            <Image
              className={styles.experienceToolImage}
              src="/social-media/facebook.svg"
              alt="Facebook Icon"
              width="50"
              height="50"
            />
          </Link>
          <Link href="https://twitter.com/canestruc" target="_blank">
            <Image
              className={styles.experienceToolImage}
              src="/social-media/hashtag.svg"
              alt="Hashtag Icon"
              width="50"
              height="50"
            />
          </Link>
        </div>
      )}
    </>
  );
}
