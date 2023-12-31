"use client";
import styles from "@/styles/admin-panel.module.sass";
import axios from "axios";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminPanel() {
  const t = useTranslations("Dashboard.Components.AdminPanel");
  const [addAdmin, setAddAdmin] = useState<undefined | boolean>();

  const handleAddAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (typeof addAdmin !== "undefined") {
        const form = e.currentTarget;

        const newAdminEmail = (
          form.elements.namedItem("newAdminInput") as HTMLInputElement
        ).value;

        const adminAddResponse = await axios.post("/api/user/manage-admin", {
          newAdminEmail,
          addAdmin,
        });

        if (adminAddResponse.status !== 200)
          throw new Error(adminAddResponse.data.message);

        form.reset();
        toast.success(adminAddResponse.data.message);
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Could not add admin");
      }
    }
  };

  return (
    <section>
      <h1>{t("title")}</h1>
      <div>
        <form onSubmit={handleAddAdminSubmit}>
          <label>{t("manageMessage")}</label>
          <input
            type="text"
            placeholder="test@example.com"
            name="newAdminInput"
            required
          />
          <div className={styles.submitButtonsContainer}>
            <button type="submit" onClick={() => setAddAdmin(false)}>
              {t("removeButton")}
            </button>
            <button type="submit" onClick={() => setAddAdmin(true)}>
              {t("addButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
