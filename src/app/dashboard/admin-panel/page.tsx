"use client";
import styles from "@/styles/admin-panel.module.sass";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminPanel() {
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
      <h1>Admin Panel:</h1>
      <div>
        <form onSubmit={handleAddAdminSubmit}>
          <label>Manage admin user:</label>
          <input
            type="text"
            placeholder="test@example.com"
            name="newAdminInput"
            required
          />
          <div className={styles.submitButtonsContainer}>
            <button type="submit" onClick={() => setAddAdmin(false)}>
              Remove
            </button>
            <button type="submit" onClick={() => setAddAdmin(true)}>
              Add
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
