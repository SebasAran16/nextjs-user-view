"use client";
import styles from "@/styles/layouts/dashboard-layout.module.sass";
import { useGlobalState } from "@/utils/globalStates";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { getUserForVariables } from "@/utils/getUserForVariable";
import { usePathname, useRouter } from "next/navigation";
import { dashboardSections } from "@/utils/arrays/dashboard-sections";
import { fromSerpentToReadable } from "@/utils/fromSerpentToReadable";
import Image from "next/image";

interface DashboardLayoutInterface {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutInterface) {
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

  return (
    <section>
      <Toaster />
      {!loading ? (
        <main id={styles.dashboardContainer}>
          <header id={styles.dashboardNav}>
            <div>
              <h1>Welcome {user?.username ? user.username : ""}</h1>
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
                    return <button>{fromSerpentToReadable(section)}</button>;
                  })}
                </div>
                <button onClick={logOut}>Logout</button>
              </nav>
            </div>
          </header>
          {children}
        </main>
      ) : (
        "Loading Layout..."
      )}
    </section>
  );
}
