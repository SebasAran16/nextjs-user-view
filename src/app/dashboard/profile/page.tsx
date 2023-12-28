"use client";
import DataViewAndEdit from "@/app/components/profile/dataViewAndEdit";
import { userDataVariablesAndManagable } from "@/utils/arrays/userData";
import { useGlobalState } from "@/utils/globalStates";
import Image from "next/image";

export default function Profile() {
  const [userData, setUserData] = useGlobalState("userData");
  const userDataVariables = Object.keys(userDataVariablesAndManagable);

  return (
    <section>
      <h1>Profile:</h1>
      <h2>Current Data:</h2>
      {userData ? (
        <>
          <div>
            <Image
              src={userData.image ?? ""}
              alt="User Image"
              height="50"
              width="50"
            />
            <DataViewAndEdit userData={userData} />
          </div>
        </>
      ) : (
        "Could not get user data"
      )}
      <hr />
      <h2>Change Password:</h2>
    </section>
  );
}
