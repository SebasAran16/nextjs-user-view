"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/signup.module.sass";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function Signup() {
  const router = useRouter();

  const [verifyToken, setVerifyToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);

  async function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const verificationCodeElement = form.elements.namedItem(
        "verificationCode"
      ) as HTMLInputElement;
      const verificationToken = verificationCodeElement.value;

      const verificationResponse = await axios.post("/api/user/verify", {
        verifyToken: verificationToken,
      });

      if (verificationResponse.status !== 200) {
        throw new Error("Token not valid");
      }

      const mailVerificationPart = document.querySelector(
        "#" + styles.mailVerificationPart
      );
      const verifiedMailPart = document.querySelector(
        "#" + styles.verifiedMailPart
      );

      mailVerificationPart!.classList.add(styles.hidden);
      verifiedMailPart!.classList.remove(styles.hidden);
      toast.success(verificationResponse.data.message);
    } catch (err: any) {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    }
  }

  async function verifyUserEmail() {
    try {
      const response = await axios.post("/api/user/verify", { verifyToken });
      setVerifiedEmail(true);
      return response;
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  }

  useEffect(() => {
    const [, gotVerifyToken] = window.location.search.split("=");

    if (gotVerifyToken) setVerifyToken(gotVerifyToken);
  }, []);

  useEffect(() => {
    if (verifyToken.length > 0) verifyUserEmail();
  }, [verifyToken]);

  useEffect(() => {
    const mailVerificationPart = document.querySelector(
      "#" + styles.mailVerificationPart
    );
    const verifiedMailPart = document.querySelector(
      "#" + styles.verifiedMailPart
    );

    if (verifiedEmail) {
      mailVerificationPart!.classList.add(styles.hidden);
      verifiedMailPart!.classList.remove(styles.hidden);
    } else {
      verifiedMailPart!.classList.add(styles.hidden);
      mailVerificationPart!.classList.remove(styles.hidden);
    }
  }, [verifiedEmail]);

  return (
    <main id={styles.signUpView}>
      <section id={styles.formSection}>
        <Toaster />
        <div id={styles.askVerificationPart} className={styles.hidden}>
          <form>
            <label>Email:</label>
            <input type="email" name="emailToVerify" />
          </form>
        </div>
        <div id={styles.mailVerificationPart} className={styles.hidden}>
          <div>
            <h2>Verify Email</h2>
            <p>We have sent a verification code to your email.</p>
          </div>
          <form name="verifyMailForm" onSubmit={handleVerifySubmit}>
            <input name="verificationCode" type="text" />
            <p>
              Did not get the code? <a href="/">Resend Code</a>
            </p>
            <button type="submit">Verify Mail</button>
          </form>
          <div>
            <p>If you did not receive the code, check your spam folder</p>
          </div>
        </div>
        <div id={styles.verifiedMailPart} className={styles.hidden}>
          <Image
            src="/verified-mail.svg"
            alt="Verified Mail Ilustration"
            width="280"
            height="229"
          />
          <div>
            <h2>Congratulations!</h2>
            <p>Your account has been verified successfully.</p>
          </div>
          <p>
            You can now <a href="/login">login</a>
          </p>
        </div>
      </section>
      <section id={styles.imageSection}></section>
    </main>
  );
}
