"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/login.module.sass";
import React from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function ForgotPassword() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const emailElement = form.elements.namedItem("email") as HTMLInputElement;

    try {
      const response = await axios.post("/api/user/forgot-password", {
        email: emailElement.value,
      });

      if (response.status !== 200) throw new Error(response.data.message);

      toast.success(response.data.message);
    } catch (err: any) {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    }
  }

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
            <p>CustomerView</p>
          </Link>
        </div>
        <div id={styles.formPart}>
          <div>
            <h2>Reset Password</h2>
            <p>Enter your new password</p>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              id={styles.signupForm}
              name="forgotForm"
            >
              <label>Existing Email</label>
              <input
                type="text"
                name="email"
                placeholder="example@gmail.com"
                required
              />

              <button type="submit">Reset Password</button>
            </form>
            <div id={styles.errorDiv} className={styles.hidden}>
              <Image
                src="/profile/icons/alert-icon-main.svg"
                alt="Alert Icon"
                width="24"
                height="24"
              />
              <p id={styles.formErrorText}></p>
            </div>
            <div id={styles.alreadyMemberDiv}>
              <p>Have no account?</p>
              <Link href="/signup">Create Account</Link>
            </div>
          </div>
        </div>
        <div id={styles.resetMailSent} className={styles.hidden}>
          <h2>Reset password mail sent</h2>
          <br />
          <p>We have sent an email for you to reset your password!</p>
        </div>
      </section>
      <section id={styles.imageSection}></section>
    </main>
  );
}
