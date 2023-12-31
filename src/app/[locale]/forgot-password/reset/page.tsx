"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/login.module.sass";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function ResetPassword() {
  const t = useTranslations("AuthFlow.ForgotPassword.Reset");
  const router = useRouter();

  const [resetToken, setResetToken] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const newPassword = form.elements.namedItem(
        "newPassword"
      ) as HTMLInputElement;
      const repeatedNewPassword = form.elements.namedItem(
        "repeatedNewPassword"
      ) as HTMLInputElement;

      const passwordsMatch = newPassword.value === repeatedNewPassword.value;

      if (!resetToken || resetToken === "") {
        throw new Error(
          "Token not provided for resetting password. Ask again!"
        );
      } else if (!passwordsMatch) {
        throw new Error("Passwords do not match");
      }

      const data = {
        token: resetToken,
        newPassword: newPassword.value,
      };

      const response = await axios.post("/api/user/reset-password", data);

      if (response.status !== 200) throw new Error(response.data.message);

      toast.success(response.data.message);
      router.push("/login");
    } catch (err: any) {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    }
  }

  useEffect(() => {
    const [, token] = window.location.search.split("=");

    if (!token) {
      toast.error("Reset password token not provided. Ask reset email again!");
    }

    setResetToken(token);
  }, []);

  return (
    <main id={styles.signUpView}>
      <section id={styles.formSection}>
        <Toaster />
        <div id={styles.logoPart}>
          <Link href="/" id={styles.logoAnchor}>
            <Image
              src="/icons/user-view-logo.png"
              alt="Logo"
              width="31"
              height="31"
            />
            <p>{t("headerCompanyName")}</p>
          </Link>
        </div>
        <div id={styles.formPart}>
          <div>
            <h2>{t("title")}</h2>
            <p>{t("sectionExplanation")}</p>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              id={styles.signupForm}
              name="resetPasswordForm"
            >
              <label>{t("newPassword")}</label>
              <input type="password" name="newPassword" required />

              <label>{t("newPasswordRepeat")}</label>
              <input type="password" name="repeatedNewPassword" required />
              <button type="submit" disabled={!resetToken}>
                {t("changePassword")}
              </button>
            </form>
            <div id={styles.alreadyMemberDiv}>
              <p>{t("noAccount")}</p>
              <Link href="/signup">{t("createAccount")}</Link>
            </div>
          </div>
        </div>
      </section>
      <section id={styles.imageSection}></section>
    </main>
  );
}
