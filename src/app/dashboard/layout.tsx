"use client";
import { useGlobalState } from "@/utils/globalStates";
import React, { useEffect, useState } from "react";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import getUserFromData from "@/utils/getUserFromData";
import { getUserForVariables } from "@/utils/getUserForVariable";

interface DashboardLayoutInterface {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutInterface) {
  const [user, setUser] = useGlobalState("userData");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(true);
      axios.get("/api/user/get-from-token").then((userResponse) => {
        if (userResponse.status !== 200)
          throw new Error(userResponse.data.message);

        const user = userResponse.data.user;
        setUser(getUserForVariables(user));
      });
    }

    setLoading(false);
  }, [user]);

  return (
    <section>
      <Toaster />
      {!loading ? (
        <>
          <nav>
            <h1>Welcome {user?.username ? user.username : ""}</h1>
          </nav>
          {children}
        </>
      ) : (
        "Loading Layout..."
      )}
    </section>
  );
}
