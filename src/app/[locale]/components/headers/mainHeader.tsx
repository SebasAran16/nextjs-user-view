"use client";
import styles from "@/styles/layouts/headers/main-header.module.sass";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { mainHeaderSections } from "@/utils/arrays/mainHeaderSections";

export default function MainHeader() {
  const t = useTranslations("Landing.mainHeader");
  const router = useRouter();
  const pathname = usePathname();

  const toggleNav = () => {
    const nav = document.querySelector(`#${styles.mainHeaderNav}`);
    nav!.classList.toggle(styles.hidden);
  };

  const closeNav = () => {
    const nav = document.querySelector(`#${styles.mainHeaderNav}`);
    nav!.classList.add(styles.hidden);
  };

  const goToSectionLink = (section: string) => {
    const segments = pathname.split("/");
    const initialPath = segments.slice(0, 2);

    router.replace([...initialPath, section].join("/"));
  };

  return (
    <>
      <header id={styles.header}>
        <div>
          <Link href="/" id={styles.logoAnchor}>
            <Image
              src="/icons/customer-view-logo.jpeg"
              alt="Logo"
              width="31"
              height="31"
            />
            <h1>{t("companyName")}</h1>
          </Link>
        </div>
        <div>
          <Image
            className={styles.navToggler}
            src="/icons/mobile-menu.svg"
            alt="Menu Icon"
            width="35"
            height="35"
            onClick={toggleNav}
          />
          <nav id={styles.mainHeaderNav} className={styles.hidden}>
            <Image
              className={styles.navToggler}
              src="/icons/close-main-color.svg"
              alt="Close Icon"
              width="35"
              height="35"
              onClick={closeNav}
            />
            <div>
              {mainHeaderSections.map((section: string, index: number) => {
                if (section === "products")
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        closeNav();
                      }}
                    >
                      {t("navigations." + section)}
                    </button>
                  );

                return (
                  <button
                    key={index}
                    onClick={() => {
                      closeNav();
                      goToSectionLink(section);
                    }}
                  >
                    {t("navigations." + section)}
                  </button>
                );
              })}
            </div>
            <div id={styles.headerButtons}>
              <Link href="/login">
                <button onClick={() => closeNav()}>
                  {t("authButtons.login")}
                </button>
              </Link>
              <Link href="/signup">
                <button onClick={() => closeNav()}>
                  {t("authButtons.signup")}
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
