"use client";
import styles from "@/styles/components/elements/profile-link.module.sass";
import Link from "next/link";
import Image from "next/image";

interface LinkGroupProps {
  groups: any[];
  mainColor: string;
  secondaryColor: string;
  textColor: string;
}

export function LinkGroup({
  groups,
  mainColor,
  secondaryColor,
  textColor,
}: LinkGroupProps) {
  return (
    <>
      <div
        id={styles.profileSection}
        className={styles.socialMediaSection}
        style={{
          background: `linear-gradient(90deg, ${secondaryColor} 0%, #3fb982 55%, ${mainColor} 100%)`,
        }}
      >
        {groups.map((group) => {
          return (
            <Link href={group.link} target="_blank">
              <Image
                className={styles.experienceToolImage}
                src={"/social-media/instagram.svg"}
                alt="Instagram Icon"
                width="50"
                height="50"
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}
