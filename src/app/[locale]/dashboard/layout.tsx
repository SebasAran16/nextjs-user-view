"use client";
import styles from "@/styles/layouts/dashboard-layout.module.sass";
import { useGlobalState } from "@/utils/globalStates";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { getUserForVariables } from "@/utils/getUserForVariable";
import { usePathname, useRouter } from "next/navigation";
import { dashboardSections } from "@/utils/arrays/dashboardSections";
import { fromSerpentToReadable } from "@/utils/fromSerpentToReadable";
import Image from "next/image";
import { fromSerpentToUrl } from "@/utils/fromSerpentToUrl";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useTranslations } from "next-intl";

interface DashboardLayoutInterface {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutInterface) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useGlobalState("userData");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(true);
      axios
        .get("/api/user/get-from-token")
        .then((userResponse) => {
          if (userResponse.status !== 200)
            throw new Error(userResponse.data.message);

          const user = userResponse.data.user;
          setUser(getUserForVariables(user));
        })
        .catch((err) => {
          console.log(err);
          toast.error("Unexpected issue happened. Could not log out");
        });
    }

    setLoading(false);
  }, [user]);

  const toggleNav = () => {
    const nav = document.querySelector(`#${styles.headerNav}`);
    nav!.classList.toggle(styles.hidden);
  };

  const closeNav = () => {
    const nav = document.querySelector(`#${styles.headerNav}`);
    nav!.classList.add(styles.hidden);
  };

  const logOut = async () => {
    try {
      axios.get("/api/user/logout").then((response) => {
        const responseMessage = response.data.message;

        if (response.status !== 200) throw new Error(responseMessage);

        toast.success(responseMessage);
        router.replace("/");
      });
    } catch (err) {
      console.log(err);
      toast.error("Could not log out");
    }
  };

  const goToSectionLink = (section: string) => {
    const segments = pathname.split("/");

    if (segments.length === 2) {
      router.replace("dashboard");
    }

    router.push(fromSerpentToUrl(section));
  };

  return (
    <>
      <Toaster />
      {!loading && user ? (
        <main id={styles.dashboardContainer}>
          <header id={styles.dashboardNav}>
            <div>
              <h1>
                {t("Header.headerTitle")}{" "}
                {user.firstname
                  ? capitalizeFirstLetter(user.firstname)
                  : user.username}
              </h1>
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
              <nav id={styles.headerNav} className={styles.hidden}>
                <Image
                  className={styles.navToggler}
                  src="/icons/close-main-color.svg"
                  alt="Close Icon"
                  width="35"
                  height="35"
                  onClick={toggleNav}
                />
                <div>
                  {dashboardSections.map((section: string, index: number) => {
                    if (
                      section === "admin_panel" &&
                      user &&
                      user.rol !== "admin"
                    )
                      return;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          closeNav();
                          goToSectionLink(section);
                        }}
                      >
                        {t("Header.navigations." + section)}
                      </button>
                    );
                  })}
                </div>
                <button onClick={logOut}>{t("Header.logout")}</button>
              </nav>
            </div>
          </header>
          {children}
        </main>
      ) : (
        "Loading Layout..."
      )}
    </>
  );
}
