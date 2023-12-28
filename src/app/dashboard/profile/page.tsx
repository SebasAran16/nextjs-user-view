"use client";
import styles from "@/styles/profile.module.sass";
import { useGlobalState } from "@/utils/globalStates";
import Image from "next/image";
import {
  IUserEdit,
  UserDataEditableVariables,
  UserDataVariables,
  userDataVariablesAndManagable,
} from "@/utils/arrays/userData";
import { toast } from "react-hot-toast";
import axios from "axios";
import React from "react";
import { fromSerpentToReadable } from "@/utils/fromSerpentToReadable";

export default function Profile() {
  const userDataVariables = Object.keys(
    userDataVariablesAndManagable
  ) as UserDataVariables[];

  const [userData, setUserData] = useGlobalState("userData");

  const handleSubmitChangeUserData = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();

      const form = e.currentTarget;
      const managableVariables = Object.entries(userDataVariablesAndManagable)
        .filter(([key, value]) => value === true)
        .map(([key]) => key);

      const updateVariables: IUserEdit = {};
      for (const variable of managableVariables) {
        const newValue = (
          form.elements.namedItem(`${variable}ChangeInput`) as HTMLInputElement
        ).value;
        updateVariables[variable as UserDataEditableVariables] = newValue;
      }

      const userEditResponse = await axios.post(
        "/api/user/update",
        updateVariables
      );

      if (userEditResponse.status !== 200)
        throw new Error(userEditResponse.data.message);

      setUserData(userEditResponse.data.user);
      form.reset();
      toast.success(userEditResponse.data.message);
    } catch (err) {
      console.log(err);
      toast.error("There was an error");
    }
  };

  const handleSubmitChangePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;

      const newPassword = (
        form.elements.namedItem("newPassword") as HTMLInputElement
      ).value;
      const newPasswordRepeated = (
        form.elements.namedItem("newPasswordRepeated") as HTMLInputElement
      ).value;

      const passwordsMatch = newPassword === newPasswordRepeated;

      if (!passwordsMatch) {
        toast.error("Passwords do not match!");
        return;
      }

      const changePasswordResponse = await axios.post("/api/user/update", {
        password: newPassword,
      });

      if (changePasswordResponse.status !== 200)
        throw new Error(changePasswordResponse.data.message);

      form.reset();
      toast.success("Password updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("There was an error");
    }
  };

  return (
    <section id={styles.profileEditContainer}>
      <h1>Profile</h1>
      <div>
        {userData ? (
          <>
            <div>
              <h2>Current Data:</h2>
              <div id={styles.profileHeaderContainer}>
                <div>
                  <Image
                    src={userData.image ?? "/defaults/user.svg"}
                    alt="User Image"
                    height="50"
                    width="50"
                  />
                  {userData.image ? "" : <p>No image set</p>}
                </div>
                <div>
                  {userData.is_verified ? (
                    <div>
                      <h4>Verified Account</h4>
                    </div>
                  ) : (
                    <div>
                      <h4>Account Not Verified</h4>
                    </div>
                  )}
                  <div>
                    <h4>Rol:</h4>
                    <p>{userData.rol}</p>
                  </div>
                  <div>
                    <h4>Created At:</h4>
                    <p>
                      {userData.created_date
                        ? userData.created_date.toString()
                        : "---"}
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmitChangeUserData}>
                {userDataVariables.map(
                  (data: UserDataVariables, index: number) => {
                    return (
                      <div key={index}>
                        <label>{fromSerpentToReadable(data)}:</label>
                        <input
                          type="text"
                          placeholder={
                            userDataVariablesAndManagable[data]
                              ? `New ${data}`
                              : userData[data]?.toString()
                          }
                          name={`${data}ChangeInput`}
                          disabled={!userDataVariablesAndManagable[data]}
                        />
                      </div>
                    );
                  }
                )}
                <button type="submit">Save</button>
              </form>
            </div>
          </>
        ) : (
          "Could not get user data"
        )}
        <hr />
        <div id={styles.changePasswordContainer}>
          <h2>Change Password:</h2>
          <form onSubmit={handleSubmitChangePassword}>
            <label>New Password:*</label>
            <input type="password" placeholder="*********" name="newPassword" />
            <label>Repeat new Password:*</label>
            <input
              type="password"
              placeholder="*********"
              name="newPasswordRepeated"
            />
            <button type="submit">Change</button>
          </form>
        </div>
      </div>
    </section>
  );
}
