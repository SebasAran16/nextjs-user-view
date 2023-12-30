"use client";
import Link from "next/link";
import styles from "@/styles/home.module.sass";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Landing");

  return (
    <main>
      <header id={styles.header}>
        <h1>{t("title")}</h1>
        <section id={styles.headerButtons}>
          <Link href="/login">
            <button>{t("authButtons.login")}</button>
          </Link>
          <Link href="/signup">
            <button>{t("authButtons.signup")}</button>
          </Link>
        </section>
      </header>
    </main>
  );
}
