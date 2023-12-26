"use client";
import styles from "@/styles/components/elements/profile-link.module.sass";
import Link from "next/link";
import Image from "next/image";
import { getImageForLinkGroupImageType } from "@/utils/getImageForLinkGroupImageType";

interface LinkGroupProps {
  groups: any[];
  mainColor: string;
  secondaryColor: string;
}

export function LinkGroup({
  groups,
  mainColor,
  secondaryColor,
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
        {groups.map((group, index) => {
          return (
            <Link key={index} href={group.link} target="_blank">
              <Image
                className={styles.experienceToolImage}
                src={getImageForLinkGroupImageType(parseInt(group.image)) ?? ""}
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
