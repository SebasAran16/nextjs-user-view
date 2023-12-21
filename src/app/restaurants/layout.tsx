"use client";
import styles from "@/styles/layouts/dashboard-layout.module.sass";
import { useGlobalState } from "@/utils/globalStates";
import React, { useEffect, useState } from "react";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import getUserFromData from "@/utils/getUserFromData";
import { getUserForVariables } from "@/utils/getUserForVariable";
import { useRouter } from "next/navigation";

interface DashboardLayoutInterface {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutInterface) {
  const router = useRouter();

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
          <nav id={styles.dashboardNav}>
            <h1>Welcome {user?.username ? user.username : ""}</h1>
            <button onClick={logOut}>Logout</button>
          </nav>
          {children}
        </main>
      ) : (
        "Loading Layout..."
      )}
    </section>
  );
}
