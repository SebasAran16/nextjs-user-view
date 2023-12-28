"use client";
import styles from "@/styles/profile.module.sass";
import DataViewAndEdit from "@/app/components/profile/dataViewAndEdit";
import { useGlobalState } from "@/utils/globalStates";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function Profile() {
  const [userData, setUserData] = useGlobalState("userData");

  const handleSubmitChangePassword = async () => {
    try {
      // Send API request
    } catch (err) {
      console.log(err);
      toast.error("There was an error");
    }
  };

  return (
    <section>
      <h1>Profile</h1>
      <h2>Current Data:</h2>
      {userData ? (
        <>
          <div>
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

            <DataViewAndEdit userData={userData} />
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
          <input type="text" placeholder="*********" name="newPassword" />
          <label>Repeat new Password:*</label>
          <input
            type="text"
            placeholder="*********"
            name="newPasswordRepeated"
          />
          <button type="submit">Change</button>
        </form>
      </div>
    </section>
  );
}
