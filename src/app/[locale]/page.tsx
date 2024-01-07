"use client";
import styles from "@/styles/home.module.sass";
import { useTranslations } from "next-intl";
import MainHeader from "./components/headers/mainHeader";

export default function Home() {
  const t = useTranslations("Landing");

  return (
    <main>
      <h2>{t("title")}</h2>
    </main>
  );
}
