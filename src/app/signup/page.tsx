"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/signup.module.sass";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useGlobalState } from "@/utils/globalStates";

export default function Signup() {
  const router = useRouter();

  const [, setUserData] = useGlobalState("userData");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      const form = e.currentTarget;

      const username = form.elements.namedItem("username") as HTMLInputElement;
      const email = form.elements.namedItem("userEmail") as HTMLInputElement;
      const password = form.elements.namedItem(
        "userPasswordOne"
      ) as HTMLInputElement;
      const repeatedPassword = form.elements.namedItem(
        "userPasswordTwo"
      ) as HTMLInputElement;

      const passwordsMatch = password.value === repeatedPassword.value;

      if (!passwordsMatch) {
        toast.error("Passwords do not match!");
        return;
      }

      const data = {
        username: username.value,
        email: email.value,
        password: password.value,
        dateCreated: Date.now(),
      };

      const response = await axios.post("/api/user/signup", data);

      if (response.status !== 200)
        throw new Error("HTTP error! status: " + response.status);

      const user = response.data.user;
      setUserData(user);

      toast.success(response.data.message);
      router.push("/verify-email");
    } catch (err: any) {
      console.log(err);
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
            <h2>Create your account</h2>
            <p>Enter following details to register yourself.</p>
          </div>
          <div>
            <form
              onSubmit={handleSignupSubmit}
              id={styles.signupForm}
              name="signupForm"
            >
              <label>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                minLength={3}
                maxLength={30}
                required
              ></input>
              <label>Email</label>
              <input
                type="email"
                name="userEmail"
                id="userEmail"
                minLength={5}
                required
              ></input>
              <label>Password</label>
              <input
                type="password"
                name="userPasswordOne"
                id="userPasswordOne"
                required
              ></input>
              <label>Repeat Password</label>
              <input
                type="password"
                name="userPasswordTwo"
                id="userPasswordTwo"
                required
              ></input>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="userTermsAccepted"
                    id="userTermsAccepted"
                    required
                  />{" "}
                  I am agreeing with <Link href="/">Privacy Policy</Link> and{" "}
                  <Link href="/">Terms & Conditions</Link>.
                </label>
              </div>
              <button type="submit">Register Now</button>
            </form>
            <div id={styles.alreadyMemberDiv}>
              <p>Already a registered?</p>
              <Link href="/login">Login</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
