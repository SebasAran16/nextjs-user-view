"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/login.module.sass";
import React, { ReactNode, useState } from "react";
import User from "@/models/user";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useGlobalState } from "@/utils/globalStates";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations("AuthFlow.Login");
  const router = useRouter();
  const [, setUserData] = useGlobalState("userData");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const usernameOrEmail = form.elements.namedItem(
        "usernameOrEmail"
      ) as HTMLInputElement;
      const password = form.elements.namedItem(
        "userPassword"
      ) as HTMLInputElement;

      const data = {
        usernameOrEmail: usernameOrEmail.value,
        password: password.value,
      };

      const response = await axios.post("/api/user/login", data);

      if (response.status !== 200) throw new Error(response.data.message);

      const user = response.data.user;
      setUserData(user);

      toast.success(response.data.message);
      router.push("/dashboard/restaurants");
    } catch (err: any) {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    }
  }

  return (
    <main id={styles.signUpView}>
      <section id={styles.formSection}>
        <Toaster />
        <div id={styles.formPart}>
          <div>
            <h2>{t("title")}</h2>
            <p>{t("sectionExplanation")}</p>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              id={styles.loginForm}
              name="loginForm"
            >
              <label>{t("loginKey")}</label>
              <input type="text" name="usernameOrEmail" required></input>

              <label>{t("password")}</label>
              <input type="password" name="userPassword" required></input>
              <button type="submit">{t("loginButton")}</button>
            </form>
            <div id={styles.alreadyMemberDiv}>
              <p>{t("forgotPasswordText")}</p>
              <Link href="/forgot-password">{t("recoverPasswordAnchor")}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
